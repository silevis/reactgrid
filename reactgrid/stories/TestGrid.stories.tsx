import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid, CellData, TextCell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";

export const TestGridExample = () => {
  const [cells, setCells] = useState<CellData[]>([
    {
      rowIndex: 0,
      colIndex: 0,
      props: {
        value: "A1",
      },
      Template: TextCell,
    },
    {
      rowIndex: 5,
      colIndex: 5,
      props: {
        value: "A5",
      },
      Template: TextCell,
    },
    {
      rowIndex: 2,
      colIndex: 3,
      props: {
        value: "A5",
      },
      Template: TextCell,
    },
  ]);

  return (
    <div>
      <ReactGrid
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setCells)
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
