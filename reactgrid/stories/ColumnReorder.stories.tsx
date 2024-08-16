import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid, CellData, Column } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";

export const ColumnReorderExample = () => {
  const [columns, setColumns] = useState<Column[]>([
    { colIndex: 0, width: 300 },
    { colIndex: 1, width: 300 },
  ]);

  const [cells, setCells] = useState<CellData[]>(initialGridData);

  return (
    <div>
      <ReactGrid
        id="column-reorder-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setCells, setColumns)
        }
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
