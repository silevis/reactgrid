import React from "react";
import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { TextCell } from "../lib/cellTemplates/TextCell";
import { NumberCell } from "../lib/cellTemplates/NumberCell";
import { CellData, Column, Row } from "../lib/types/PublicModel";
import { handleFill } from "./utils/handleFill";
import { handleCut } from "./utils/handleCut";
import { handlePaste } from "./utils/handlePaste";
import { handleCopy } from "./utils/handleCopy";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleRowReorder } from "./utils/handleRowReorder";
import { IndexedLocation } from "../lib/types/InternalModel";
import { handleResizeColumn } from "./utils/handleResizeColumn";

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

const generateCellData = (i: number, j: number): CellData => {
  // if (i === 1 && j === 4) return null;
  // if (i === 1 && j === 24) return null;
  // if (i === 3 && j === 4) return null;
  // if (i === 4 && j === 3) return null;
  // if (i === 4 && j === 4) return null;
  // if (i === 5 && j === 6) return null;
  // if (i === 5 && j === 7) return null;
  // if (i === 6 && j === 4) return null;
  // if (i === 6 && j === 7) return null;
  // if (i === 6 && j === 8) return null;
  // if (i === 19 && j === 1) return null;
  // if (i === 1 && j === 24) return null;

  // if (i === 5 && j === 8) return null;

  const cellIdx = {
    rowIndex: i,
    colIndex: j,
  };

  if (i === 0) return { ...cellIdx, props: { value: `Col ${j}` }, Template: TextCell, isFocusable: false };
  if (i === 5 && j === 3) return { ...cellIdx, props: { value: 100, format: myNumberFormat }, Template: NumberCell };
  if (i === 1 && j === 3)
    return {
      ...cellIdx,
      props: { value: "Lorem ipsum dolor sit amet" },
      Template: TextCell,
      colSpan: 2,
    };
  if (i === 1 && j === 23)
    return {
      ...cellIdx,
      props: { value: "Lorem ipsum dolor sit amet" },
      Template: TextCell,
      colSpan: 2,
    };
  if (i === 3 && j === 3)
    return { ...cellIdx, props: { value: "Lorem ipsum dolor sit amet" }, Template: TextCell, colSpan: 2, rowSpan: 2 };
  if (i === 5 && j === 4)
    return {
      ...cellIdx,
      props: { value: "Reiciendis illum, nihil, ab officiis explicabo!" },

      Template: TextCell,
      rowSpan: 2,
    };
  if (i === 5 && j === 5)
    return {
      ...cellIdx,
      props: { value: "Excepturi in adipisci omnis illo eveniet obcaecati!" },
      Template: TextCell,
      colSpan: 3,
    };
  if (i === 6 && j === 6) return { ...cellIdx, props: { value: "Doloremque, sit!" }, Template: TextCell, colSpan: 3 };
  if (i === 18 && j === 1) return { ...cellIdx, props: { value: "Doloremque, sit!" }, Template: TextCell, rowSpan: 2 };

  if (i > 0 && j === 0) {
    return {
      ...cellIdx,
      props: {
        value:
          `[${i.toString()}:${j.toString()}]` +
          [
            "Lorem ipsum dolor sit amet",
            "Reiciendis illum, nihil, ab officiis explicabo!",
            "Excepturi in adipisci omnis illo eveniet obcaecati!",
            "Doloremque, sit!",
          ][Math.floor(Math.random() * 4)],
      },
      Template: TextCell,
      isFocusable: false,
    };
  }

  return {
    ...cellIdx,
    props: {
      value:
        `[${i.toString()}:${j.toString()}]` +
        [
          "Lorem ipsum dolor sit amet",
          "Reiciendis illum, nihil, ab officiis explicabo!",
          "Excepturi in adipisci omnis illo eveniet obcaecati!",
          "Doloremque, sit!",
        ][Math.floor(Math.random() * 4)],
    },
    Template: TextCell,
  };
};

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

  const [cells, setCells] = useState<CellData[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => generateCellData(i, j));
    })
  );

  const [toggleRanges, setToggleRanges] = useState(false);

  console.log("cells", cells);

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          rows={rows}
          columns={columns}
          onCellChanged={(cellLocation: IndexedLocation, newValue) => {
            setCells((prev) => {
              const next = [...prev];
              const cell = next[cellLocation.rowIndex][cellLocation.colIndex];
              if (cell !== null && cell.props !== undefined) {
                cell.props.value = newValue;
              }
              return next;
            });
          }}
          cells={cells}
          stickyTopRows={5}
          stickyLeftColumns={3}
          stickyRightColumns={3}
          stickyBottomRows={4}
          styles={testStyles}
          styledRanges={toggleRanges ? styledRanges : []}
          onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, cells, setColumns)}
          onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
            handleRowReorder(selectedRowIndexes, destinationRowIdx, setRows, setCells)
          }
          onColumnReorder={(selectedColIndexes, destinationColIdx) =>
            handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setCells)
          }
          enableColumnSelectionOnFirstRow
          enableRowSelectionOnFirstColumn
          onAreaSelected={(selectedArea) => {}}
          onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setCells)}
          onCut={(selectedArea) => handleCut(cells, selectedArea, setCells)}
          onPaste={(selectedArea, pastedData) => handlePaste(selectedArea, pastedData, setCells)}
          onCopy={(selectedArea) => handleCopy(cells, selectedArea)}
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
