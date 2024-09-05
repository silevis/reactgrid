import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid, CellData, Column, Cell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, initialGridData, generateCells } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";

export const ColumnReorderExample = () => {
  const [columns, setColumns] = useState<Column[]>([
    { colIndex: 0, width: 300 },
    { colIndex: 1, width: 300 },
    { colIndex: 2, width: 100 },
    { colIndex: 3, width: 50 },
  ]);

  const [data, setData] = useState<CellData[]>(initialGridData);

  const [cells] = useState<Cell[]>(generateCells(data));

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
