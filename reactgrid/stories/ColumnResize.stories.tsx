import React from "react";
import { StrictMode, useState } from "react";
import { CellData, Column, ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleResizeColumn } from "./utils/handleResizeColumn";

export const ColumnResizeExample = () => {
  const [columns, setColumns] = useState<Column[]>([
    { colIndex: 0, width: 300 },
    { colIndex: 1, width: 300 },
    { colIndex: 2, width: 300 },
  ]);

  const [cells, setCells] = useState<CellData[]>(initialGridData);

  return (
    <div>
      <ReactGrid
        id="column-resize-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, setColumns)}
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        columns={columns}
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
