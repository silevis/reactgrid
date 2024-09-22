"use client";

import logo from "@/public/static/logo-green.svg";
import checkIcon from "@/public/static/check-icon.svg";
import dotIcon from "@/public/static/dot-icon.svg";
import Image from "next/image";
import {
  Cell,
  NonEditableCell,
  NumberCell,
  ReactGrid,
  Row,
  TextCell,
} from "@silevis/reactgrid";
import { useState } from "react";
import { BudgetData, budgetsData, generateEntityData } from "./utils/BP";
import { ChevronCell } from "./cellTemplates/ChevronCell";

const capabilities = [
  "This budget planner example shows the possibility of calculating values of all aggregation fields in a reactive way in two axes - for organization or project for some time. See the available functionality:",
  "Only white cells are able to change their value (all the aggregation cells will be updated accordingly)",
  "A new value entered for a certain quarter on a given node will be proportionally distributed into the months within this quarter",
  `Reorder a single row by drag & drop action onto a selected row (you can't reorder multiple rows)`,
  "Fold/unfold unit node with SPACE key (node cell has to be focused) or click on the chevron icon",
  `Add a new row by clicking 'Add child row' in the context menu option on a selected row or delete it via 'Remove row' option`,
];

const coreFeatures = [
  {
    name: "Vertical and horizontal grouping",
    docs: true,
  },
  {
    name: "Custom cell templates (e.g. non editable number cell)",
    docs: true,
  },
  {
    name: "Context menu (adding and removing row)",
    docs: true,
  },
  {
    name: "Sticky row and column",
    docs: true,
  },
  {
    name: "Row reordering",
    docs: true,
  },
  {
    name: "Range, column and row selection (+ multi selection)",
    docs: true,
  },
  {
    name: "Fill handle",
    docs: false,
  },
  {
    name: "Copy/cut/paste",
    docs: false,
  },
  {
    name: "Touch capability",
    docs: false,
  },
];

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

export default function ExamplesPage() {
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

  console.log("BPData", BPData);

  const [columnDefs] = useState<ColumnDef[]>(() => {
    const budgetObj = Object.keys(BPData[0]).filter(
      (el) => el !== "id" && el !== "position" && el !== "name"
    );

    const getQuarter = (month: string) => {
      if (["01", "02", "03"].includes(month)) return "Q1";
      if (["04", "05", "06"].includes(month)) return "Q2";
      if (["07", "08", "09"].includes(month)) return "Q3";
      if (["10", "11", "12"].includes(month)) return "Q4";
    };

    const sortMonths = (months: string[]) => {
      // Sort months in chronological order
      return months.sort((a, b) => parseInt(a) - parseInt(b));
    };

    // Reduce the budget data to create the desired column structure
    const columnTitles = budgetObj.reduce<string[]>((acc, curr) => {
      const months = sortMonths(
        Object.keys(BPData[0][curr as keyof BudgetData])
      );
      let lastQuarter = "";

      // Add the year as the first element
      acc.push(curr);

      months.forEach((month) => {
        const currentQuarter = getQuarter(month);
        if (currentQuarter !== lastQuarter) {
          if (currentQuarter) {
            acc.push(currentQuarter); // Add the quarter label
          }
          lastQuarter = currentQuarter || ""; // Update the lastQuarter tracker
        }
        acc.push(month); // Add the month itself
      });

      return acc; // Append the processed data
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
        });
      });
    } else {
      const tableCells = columnDefs.map((col) => {
        const month = col.title;
        let year = null;

        // Determine the year for the current month
        if (/\d{2}/.test(month)) {
          // Check if the title is a month (e.g., "01")
          // Find the last year title before this month
          for (let i = col.colIndex - 1; i >= 0; i--) {
            if (/^\d{4}$/.test(columnDefs[i].title)) {
              // Check if it's a year (e.g., "2023")
              year = columnDefs[i].title;
              break;
            }
          }
        }

        console.log({ year, month });

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
                WebkitBoxShadow:
                  "inset -9px 0px 20px -20px rgba(66, 68, 90, 1)",
                MozBoxShadow: "inset -9px 0px 20px -20px rgba(66, 68, 90, 1)",
                boxShadow: "inset -9px 0px 20px -20px rgba(66, 68, 90, 1)",
              },
            },
          };
        }

        return {
          rowIndex: row.rowIndex,
          colIndex: col.colIndex,
          Template: NumberCell,
          props: {
            value: 0,
            style: {
              backgroundColor: row.isExpandable ? "#e2e2e2" : "#fff",
            },
          },
        };
      });

      cells.push(...tableCells);
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
    <section>
      <div className="grid grid-cols-main grid-rows-2 pt-[128px] pb-[40px]">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-black-primary px-4">
          Configurable example
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4">
          Congue dictum neque, nibh at vel turpis dignissim felis pellentesque.
          Nulla iaculis faucibus nisi nunc netus dolor.
        </p>
      </div>
      <div className="relative h-[600px] md:h-[800px] grid grid-cols-main react-grid-sample2">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 h-full shadow-reactgrid-sample rounded-t-[16px] text-[#a5a5a5] font-bold text-xl bg-white-primary">
          <div className="h-[60px] border-b-1 border-white-secondary3 flex items-center ps-5">
            <Image src={logo} alt="ReactGrid" />
          </div>
          <div className="flex" style={{ width: "100%", overflow: "auto" }}>
            <ReactGrid
              cells={cells}
              rows={gridRows}
              stickyLeftColumns={1}
              columns={gridColumns}
              styles={{
                gridWrapper: {
                  fontSize: "16px",
                  color: "#000",
                  fontWeight: "normal",
                  fontFamily: "Arial",
                },
                paneContainer: {
                  left: {
                    background: "#fff",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-main pt-[80px] bg-white-secondary4">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary flex gap-x-16 mb-[128px] flex-col md:flex-row px-4">
          <div className="flex-1">
            <h2 className="text-black-primary font-bold text-sm">
              Capabilities
            </h2>
            <ul>
              {capabilities.map((name, index) => (
                <li key={index} className="my-8 flex items-start">
                  <Image src={dotIcon} alt="ReactGrid" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-black-primary font-bold text-sm">
              Core features (applied)
            </h2>
            <ul>
              {coreFeatures.map((cf, index) => (
                <li key={index} className="my-8 flex items-start">
                  <Image src={checkIcon} alt="ReactGrid" />
                  {cf.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
