import React from "react";
import { StrictMode, useState } from "react";
import { Column, Row, ReactGrid, CellChange } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { initialColumns, initialRows, CellData, rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { IndexedLocation } from "../lib/types/InternalModel";

export const ColumnReorderExample = () => {
  const [columns, setColumns] = useState<Array<Column>>(initialColumns);
  const [rows, setRows] = useState<Array<Row>>(initialRows);
  const [cells, setCells] = useState<CellData[][]>(initialGridData);

  return (
    <div>
      <ReactGrid
        id="column-reorder-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setCells)
        }
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        onCellChanged={(cellLocation: IndexedLocation, newValue: CellChange<CellData["value"]>) => {
          setCells((prev) => {
            const next = [...prev];

            next[cellLocation.rowIndex][cellLocation.colIndex].value = newValue;
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
