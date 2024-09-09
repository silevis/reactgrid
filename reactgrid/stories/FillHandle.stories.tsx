import React from "react";
import { StrictMode, useState } from "react";
import { Column, ReactGrid, Row } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, generateCells } from "./utils/examplesConfig";
import { handleFill } from "./utils/handleFill";

export const FillHandleExample = () => {
  const [rows, setRows] = useState<Row[]>([
    { initialRowIndex: 0, rowIndex: 0, height: 30, reorderable: false },
    { initialRowIndex: 1, rowIndex: 1, height: 30 },
    { initialRowIndex: 2, rowIndex: 2, height: 30 },
    { initialRowIndex: 3, rowIndex: 3, height: 30 },
    { initialRowIndex: 4, rowIndex: 4, height: 30 },
  ]);

  const [columns, setColumns] = useState<Column[]>([
    { initialColIndex: 0, colIndex: 0, width: 100 },
    { initialColIndex: 1, colIndex: 1, width: 50 },
    { initialColIndex: 2, colIndex: 2, width: 200 },
    { initialColIndex: 3, colIndex: 3, width: 100 },
  ]);

  const [people, setPeople] = useState(peopleArr);

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p._id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const cells = generateCells(rows, columns, people, updatePerson);

  return (
    <div>
      <ReactGrid
        id="fill-handle-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onFillHandle={handleFill}
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        rows={rows}
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
