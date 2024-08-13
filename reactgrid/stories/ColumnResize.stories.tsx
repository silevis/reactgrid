import React from "react";
import { StrictMode, useState } from "react";
import { Column, Row, ReactGrid, CellData } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { initialColumns, initialRows, rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleResizeColumn } from "./utils/handleResizeColumn";

export const ColumnResizeExample = () => {
  const [rows, setRows] = useState<Array<Row>>(initialRows);
  const [columns, setColumns] = useState<Array<Column>>(initialColumns);
  const [cells, setCells] = useState<CellData[][]>(initialGridData);

  return (
    <div>
      <ReactGrid
        id="column-resize-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        enableResizeColumns
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        onCellChanged={(cellLocation, newValue) => {
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
        rows={rows}
        columns={columns}
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
