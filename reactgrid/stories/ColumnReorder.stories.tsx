import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid, CellData } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { IndexedLocation } from "../lib/types/InternalModel";

export const ColumnReorderExample = () => {
  const [cells, setCells] = useState<CellData[]>(initialGridData);

  console.log("cells", cells);

  return (
    <div>
      <ReactGrid
        id="column-reorder-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        // onColumnReorder={(selectedColIndexes, destinationColIdx) =>
        //   handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setCells)
        // }
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        onCellChanged={(cellLocation: IndexedLocation, newValue) => {
          setCells((prev) => {
            const next = [...prev];

            const cell = next.find(
              (cell) => cell.rowIndex === cellLocation.rowIndex && cell.colIndex === cellLocation.colIndex
            );

            if (cell?.props !== undefined) {
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
