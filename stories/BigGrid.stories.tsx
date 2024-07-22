import React from "react";
import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { TextCell } from "../lib/cellTemplates/TextCell";
import { cellMatrixBuilder } from "../lib/utils/cellMatrixBuilder";
import { NumberCell } from "../lib/cellTemplates/NumberCell";
import { Column, Row } from "../lib/types/PublicModel";
import { handleFill } from "./utils/handleFill";
import { handleCut } from "./utils/handleCut";
import { handlePaste } from "./utils/handlePaste";
import { handleCopy } from "./utils/handleCopy";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleResizeColumn } from "./utils/handleResizeColumn";
import { handleRowReorder } from "./utils/handleRowReorder";
import { DateCell } from "./cellTemplates/DateCell";

interface CellData {
  text?: string;
  number?: number;
  date?: Date;
}

const styledRanges = [
  {
    range: { start: { rowIndex: 0, columnIndex: 5 }, end: { rowIndex: 14, columnIndex: 12 } },
    styles: { background: "red", color: "yellow" },
  },
  {
    range: { start: { rowIndex: 7, columnIndex: 10 }, end: { rowIndex: 10, columnIndex: 14 } },
    styles: { background: "green", color: "purple" },
  },
];

const ROW_COUNT = 20;
const COLUMN_COUNT = 25;

const testStyles = {};

const myNumberFormat = new Intl.NumberFormat("pl", {
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currency: "PLN",
});

export const BigGrid = () => {
  const [columns, setColumns] = useState<Array<Column>>(
    Array.from({ length: COLUMN_COUNT }).map((_, j) => ({
      width: 150,
      reorderable: true,
      resizable: true,
    }))
  );
  const [rows, setRows] = useState<Array<Row>>(
    Array.from({ length: ROW_COUNT }).map((_, j) => {
      if (j === 0) return { height: "100px", reorderable: true };

      return { height: "max-content", reorderable: true };
    })
  );

  const [gridData, setGridData] = useState<(CellData | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 1 && j === 4) return null;
        // if (i === 1 && j === 24) return null;
        // if (i === 2 && j === 4) return null;
        // if (i === 3 && j === 3) return null;
        // if (i === 3 && j === 4) return null;

        // if (i === 3 && j === 7) return null;
        // if (i === 4 && j === 6) return null;
        // if (i === 4 && j === 7) return null;

        // if (i === 5 && j === 6) return null;
        // if (i === 5 && j === 7) return null;

        // if (i === 6 && j === 4) return null;

        // if (i === 6 && j === 7) return null;
        // if (i === 6 && j === 8) return null;

        if (i === 1 && j === 3) return { date: new Date() };
        if (i === 1 && j === 23) return { date: new Date() };

        if (i === 0 && j === 0) return { number: 100 };

        if (i === 2 && j === 3) return { number: 125 };

        return {
          text:
            `[${i.toString()}:${j.toString()}]` +
            [
              "Lorem ipsum dolor sit amet",
              "Reiciendis illum, nihil, ab officiis explicabo!",
              "Excepturi in adipisci omnis illo eveniet obcaecati!",
              "Doloremque, sit!",
            ][Math.floor(Math.random() * 4)],
        };
      });
    })
  );

  const cellMatrix = cellMatrixBuilder(rows, columns, ({ setCell }) => {
    gridData.forEach((row, rowIndex) => {
      row.forEach((val, columnIndex) => {
        if (val === null) return;

        if (rowIndex === 0) {
          setCell(
            rowIndex,
            columnIndex,
            TextCell,
            {
              value: val?.text,
              onTextChanged: (data) => {
                setGridData((prev) => {
                  const next = [...prev];
                  if (next[rowIndex][columnIndex] !== null) {
                    next[rowIndex][columnIndex].text = data;
                  }
                  return next;
                });
              },
            },
            { isFocusable: false }
          );
          return;
        }

        setCell(rowIndex, columnIndex, TextCell, {
          value: val?.text,
          onTextChanged: (data) => {
            setGridData((prev) => {
              const next = [...prev];
              if (next[rowIndex][columnIndex] !== null) {
                next[rowIndex][columnIndex].text = data;
              }
              return next;
            });
          },
        });
      });
    });

    // setCell(0, 0, NumberCell, {
    //   value: gridData[0][0]?.number ?? 0,
    //   validator: (value) => !isNaN(value),
    //   errorMessage: "ERR",
    //   format: myNumberFormat,
    //   hideZero: true,
    //   onValueChanged: (newNumber) => {
    //     setGridData((prev) => {
    //       const next = [...prev];
    //       next[0][0] = { number: newNumber };
    //       return next;
    //     });
    //   },
    // });

    setCell(
      1,
      3,
      DateCell,
      {
        value: gridData[1][3]?.date,
        onDateChanged: (newDate) => {
          setGridData((prev) => {
            const next = [...prev];
            next[1][3] = newDate;
            return next;
          });
        },
      },
      { colSpan: 2 }
    );

    // setCell(
    //   1,
    //   23,
    //   DateCell,
    //   {
    //     value: gridData[1][23]?.date,
    //     onDateChanged: (newDate) => {
    //       setGridData((prev) => {
    //         const next = [...prev];
    //         next[1][23] = newDate;
    //         return next;
    //       });
    //     },
    //   },
    //   { colSpan: 2 }
    // );

    // setCell(
    //   2,
    //   3,
    //   NumberCell,
    //   {
    //     value: gridData[2][3]?.number ?? 0,
    //     validator: (value) => !isNaN(value),
    //     errorMessage: "ERR",
    //     format: myNumberFormat,
    //     hideZero: true,
    //     onValueChanged: (newNumber) => {
    //       setGridData((prev) => {
    //         const next = [...prev];
    //         next[2][3] = { number: newNumber };
    //         return next;
    //       });
    //     },
    //   },
    //   { colSpan: 2, rowSpan: 2 }
    // );
    // setCell(
    //   3,
    //   3,
    //   TextCell,
    //   { value: gridData[3][6]?.text ?? "", onTextChanged: () => null },
    //   { colSpan: 2, rowSpan: 2 }
    // );
    // setCell(5, 4, TextCell, { value: gridData[5][4]?.text ?? "", onTextChanged: () => null }, { rowSpan: 2 });
    // setCell(5, 5, TextCell, { value: gridData[5][5]?.text ?? "", onTextChanged: () => null }, { colSpan: 3 });
    // setCell(6, 6, TextCell, { value: gridData[6][6]?.text ?? "", onTextChanged: () => null }, { colSpan: 3 });
    // setCell(18, 1, TextCell, { value: gridData[18][1]?.text ?? "", onTextChanged: () => null }, { rowSpan: 2 });
  });

  console.log("cellMatrix", cellMatrix);

  const [toggleRanges, setToggleRanges] = useState(false);

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          stickyTopRows={3}
          stickyLeftColumns={3}
          stickyRightColumns={2}
          stickyBottomRows={2}
          styles={testStyles}
          styledRanges={toggleRanges ? styledRanges : []}
          onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, cellMatrix, setColumns)}
          {...cellMatrix}
          onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
            handleRowReorder(selectedRowIndexes, destinationRowIdx, setRows, setGridData)
          }
          onColumnReorder={(selectedColIndexes, destinationColIdx) =>
            handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setGridData)
          }
          enableColumnSelectionOnFirstRow
          enableRowSelectionOnFirstColumn
          onAreaSelected={(selectedArea) => {}}
          onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setGridData)}
          onCut={(selectedArea) => handleCut(gridData, selectedArea, setGridData)}
          onPaste={(selectedArea, pastedData) => handlePaste(selectedArea, pastedData, setGridData)}
          onCopy={(selectedArea) => handleCopy(gridData, selectedArea)}
          onCellFocused={(cellLocation) => {}}
        />
        <button onClick={() => setToggleRanges((prev) => !prev)}>toggle ranges</button>
      </div>
    </>
  );
};

export default {
  decorators: [
    (Component) => (
      <StrictMode>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </StrictMode>
    ),
  ],
} satisfies StoryDefault;
