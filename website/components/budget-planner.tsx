import { ChevronCell } from "@/app/examples/cellTemplates/ChevronCell";
import {
  BudgetData,
  budgetsData,
  generateEntityData,
  MonthlyData,
} from "@/app/examples/utils/BP";
import {
  Cell,
  NonEditableCell,
  NumberCell,
  ReactGrid,
  TextCell,
} from "@silevis/reactgrid";
import { useState } from "react";

export interface RowDef {
  rowIndex: number;
  height: number;
  isExpandable: boolean;
  reorderable?: boolean;
}

interface ColumnDef {
  colIndex: number;
  title: string;
  width: number;
}

const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const BudgetPlanner = () => {
  const [BPData, setBPData] = useState(
    budgetsData.reduce<BudgetData[]>((acc, curr) => {
      if (curr.id === 5) {
        return [
          ...acc,
          generateEntityData(1, "Silevis organization", true),
          generateEntityData(2, "Expenses", true),
          generateEntityData(3, "Fixed", true),
          generateEntityData(4, "Salaries", true),
          curr,
        ];
      }
      if (curr.id === 9) {
        return [...acc, generateEntityData(8, "Office costs", true), curr];
      }
      if (curr.id === 14) {
        return [...acc, generateEntityData(13, "One-time", true), curr];
      }

      return [...acc, curr];
    }, [])
  );

  const [columnDefs] = useState<ColumnDef[]>(() => {
    const budgetObj = Object.keys(BPData[0]).filter(
      (el) => !["id", "position", "name", "isExpandable"].includes(el)
    );

    const getQuarter = (month: string) => `Q${Math.ceil(parseInt(month) / 3)}`;

    const sortMonths = (months: string[]) => {
      return months.sort((a, b) => parseInt(a) - parseInt(b));
    };

    // Reduce the budget data to create the desired column structure
    const columnTitles = budgetObj.reduce<string[]>((acc, curr) => {
      const months = sortMonths(
        Object.keys(BPData[0][curr as keyof BudgetData])
      );
      let lastQuarter = "";

      acc.push(curr);

      months.forEach((month) => {
        const currentQuarter = getQuarter(month);
        if (currentQuarter !== lastQuarter) {
          if (currentQuarter) {
            acc.push(currentQuarter); // Add the quarter label
          }
          lastQuarter = currentQuarter || ""; // Update the lastQuarter tracker
        }
        acc.push(month);
      });

      return acc;
    }, []);

    return ["Organization / Period", ...columnTitles].map((col, index) => {
      return {
        width: 220,
        colIndex: index,
        title: col,
      };
    });
  });

  const rowsWithAssignedHeights = BPData.map((budget, i) => ({
    id: budget.id,
    height: 45,
    isExpandable: budget.isExpandable,
    position: budget.position,
  }));

  const headerRow = [{ id: 0, position: 0, height: 40, isExpandable: false }];
  const orderedRows: RowDef[] = [...headerRow, ...rowsWithAssignedHeights]
    .sort((a, b) => a.position - b.position)
    .map((row) => {
      const idx = rowsWithAssignedHeights.findIndex((r) => r.id === row.id);
      const adjustedIdx = idx === -1 ? 0 : idx + 1;

      if (adjustedIdx === 0) {
        return {
          id: row.id,
          rowIndex: adjustedIdx,
          isExpandable: false,
          height: row.height,
          reorderable: false,
        };
      }

      return {
        rowIndex: adjustedIdx,
        height: row.height,
        isExpandable: row.isExpandable,
      };
    });

  const gridColumns = columnDefs.map((col, index) => ({
    colIndex: index,
    width: col.width,
  }));

  const cells: Cell[] = [];

  console.log("orderedRows", orderedRows);
  console.log("columnDefs", columnDefs);

  orderedRows.forEach((row) => {
    if (row.rowIndex === 0) {
      columnDefs.forEach((col, colIndex) => {
        cells.push({
          rowIndex: row.rowIndex,
          colIndex,
          Template: NonEditableCell,
          props: {
            value: col.title,
            style: {
              backgroundColor: "#55bc71",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            },
          },
          isSelectable: false,
          isFocusable: false,
        });
      });
    } else {
      const gridCells = columnDefs.map((col) => {
        const colTitle = col.title;
        let year = null;

        // Determine if the title is a year, quarter, or month
        const isYear = /^\d{4}$/.test(colTitle);
        const isQuarter = /^Q[1-4]$/.test(colTitle);
        const isMonth = /^\d{2}$/.test(colTitle);

        const previousTitles = columnDefs
          .slice(0, col.colIndex)
          .map((colDef) => colDef.title);

        const lastYearTitle = previousTitles
          .reverse()
          .find((title) => /^\d{4}$/.test(title));

        if (/^\d{4}$/.test(colTitle)) {
          year = colTitle;
        } else {
          year = lastYearTitle;
        }

        if (row.rowIndex > 0 && col.colIndex === 0) {
          return {
            rowIndex: row.rowIndex,
            colIndex: col.colIndex,
            Template: BPData[row.rowIndex - 1].isExpandable
              ? ChevronCell
              : TextCell,
            props: {
              text: BPData[row.rowIndex - 1].name,
              onTextChanged: (v: string) => {
                setBPData((prev) => {
                  const updatedData = [...prev];
                  updatedData[row.rowIndex - 1].name = v;
                  return updatedData;
                });
              },
              style: {
                boxShadow: "inset -9px 0px 20px -20px rgba(66, 68, 90, 1)",
              },
            },
            isSelectable: false,
          };
        }

        if (isQuarter) {
          const quarterColIdx = columnDefs.findIndex(
            (c) => c.title === colTitle
          );

          const yearData = BPData[row.rowIndex - 1][
            year as keyof BudgetData
          ] as MonthlyData;

          const quarterValue =
            (yearData[
              columnDefs[quarterColIdx + 1].title as keyof MonthlyData
            ] || 0) +
            (yearData[
              columnDefs[quarterColIdx + 2].title as keyof MonthlyData
            ] || 0) +
            (yearData[
              columnDefs[quarterColIdx + 3].title as keyof MonthlyData
            ] || 0);

          return {
            rowIndex: row.rowIndex,
            colIndex: col.colIndex,
            Template: row.isExpandable ? NonEditableCell : NumberCell,
            props: {
              value: quarterValue,
              style: {
                backgroundColor:
                  isYear || row.isExpandable ? "#e1e1e1" : "#fff",
              },
              onValueChanged: (newValue: number) => {
                const dividedValue = newValue / 3;
                setBPData((prev) => {
                  const updatedData = [...prev];
                  const yearData = updatedData[row.rowIndex - 1][
                    year as keyof BudgetData
                  ] as MonthlyData;
                  yearData[
                    columnDefs[quarterColIdx + 1].title as keyof MonthlyData
                  ] = dividedValue;
                  yearData[
                    columnDefs[quarterColIdx + 2].title as keyof MonthlyData
                  ] = dividedValue;
                  yearData[
                    columnDefs[quarterColIdx + 3].title as keyof MonthlyData
                  ] = dividedValue;
                  return updatedData;
                });
              },
              format: numberFormat,
            },
          };
        }

        if (isYear) {
          const yearData = BPData[row.rowIndex - 1][
            year as keyof BudgetData
          ] as MonthlyData;

          return {
            rowIndex: row.rowIndex,
            colIndex: col.colIndex,
            Template: NonEditableCell,
            props: {
              value: numberFormat.format(
                Object.values(yearData).reduce((acc, curr) => acc + curr, 0)
              ),
              style: {
                backgroundColor:
                  isYear || row.isExpandable ? "#e1e1e1" : "#fff",
              },
            },
          };
        }

        if (isMonth) {
          const yearData = BPData[row.rowIndex - 1][
            year as keyof BudgetData
          ] as MonthlyData;

          const monthValue = yearData[colTitle as keyof MonthlyData];

          return {
            rowIndex: row.rowIndex,
            colIndex: col.colIndex,
            Template: isYear || row.isExpandable ? NonEditableCell : NumberCell,
            props: {
              value: monthValue,
              style: {
                backgroundColor:
                  isYear || row.isExpandable ? "#e1e1e1" : "#fff",
              },
              onValueChanged: (newValue: number) => {
                setBPData((prev) => {
                  const updatedData = [...prev];
                  (
                    updatedData[row.rowIndex - 1][
                      year as keyof BudgetData
                    ] as MonthlyData
                  )[colTitle as keyof MonthlyData] = newValue;
                  return updatedData;
                });
              },
              format: numberFormat,
            },
          };
        }

        return {
          rowIndex: row.rowIndex,
          colIndex: col.colIndex,
          Template: isYear || row.isExpandable ? NonEditableCell : NumberCell,
          props: {
            value: 0,
            style: {
              backgroundColor: isYear || row.isExpandable ? "#e1e1e1" : "#fff",
            },
            format: numberFormat,
          },
        };
      });

      cells.push(...gridCells);
    }
  });

  // Rows that are actually used in the grid
  const gridRows = orderedRows.map((rowDef, index) => {
    if (index === 0) {
      return {
        rowIndex: index,
        height: rowDef.height,
        ...(rowDef.reorderable === false && { reorderable: false }),
      };
    }
    return { rowIndex: index, height: rowDef.height };
  });

  console.log(JSON.stringify(cells));

  return (
    <ReactGrid
      cells={cells}
      rows={gridRows}
      stickyLeftColumns={1}
      enableRowSelectionOnFirstColumn
      columns={gridColumns}
      styles={{
        gridWrapper: {
          fontSize: "16px",
          color: "#000",
          fontWeight: "light",
          fontFamily: "Poppins",
        },
        paneContainer: {
          left: {
            background: "#fff",
          },
        },
      }}
    />
  );
};
