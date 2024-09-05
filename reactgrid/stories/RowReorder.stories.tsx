import React, { StrictMode, useState } from "react";
import { Cell, ReactGrid, Row } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleRowReorder } from "./utils/handleRowReorder";

export const RowReorderExample = () => {
  const [rows, setRows] = useState<Row[]>([{ rowIndex: 0, height: 40 }]);
  const [cells, setCells] = useState<Cell[]>(initialGridData);

  return (
    <div>
      <ReactGrid
        id="row-reorder-example"
        styles={rgStyles}
        enableRowSelectionOnFirstColumn
        onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
          handleRowReorder(selectedRowIndexes, destinationRowIdx, setCells, setRows)
        }
        onCellChanged={(cellLocation, newValue) => {
          setCells((prev) => {
            const next = [...prev];
            const cell = next.find(
              (cell) => cell.rowIndex === cellLocation.rowIndex && cell.colIndex === cellLocation.colIndex
            );
            if (cell && cell.props !== undefined) {
              cell.props.value = newValue;
            }
            return next;
          });
        }}
        rows={rows}
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        cells={cells}
      />
    </div>
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
