import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid, CellData, TextCell, Column, Row } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";

export const TestGridExample = () => {
  const [columns, setColumns] = useState<Column[]>([
    { colIndex: 0, width: 100 },
    { colIndex: 1, width: 100 },
    { colIndex: 2, width: 100 },
  ]);
  const [rows, setRows] = useState<Row[]>([
    { rowIndex: 0, height: 100 },
    { rowIndex: 1, height: 100 },
    { rowIndex: 2, height: 100 },
  ]);

  const [cells, setCells] = useState<CellData[]>(() => [
    {
      rowIndex: 0,
      colIndex: 0,
      props: {
        value: "0-0",
      },
      Template: TextCell,
    },
    {
      rowIndex: 5,
      colIndex: 5,
      props: {
        value: "5-5",
      },
      Template: TextCell,
    },
    {
      rowIndex: 3,
      colIndex: 3,
      props: {
        value: "3-3",
      },
      Template: TextCell,
    },
  ]);

  return (
    <div>
      <ReactGrid
        id="test-grid"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setCells, setColumns)
        }
        rows={rows}
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
