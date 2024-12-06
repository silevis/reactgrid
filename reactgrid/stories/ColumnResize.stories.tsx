import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, generateCells, getColumns, getRows } from "./utils/examplesConfig";
import { handleResizeColumn } from "./utils/handleResizeColumn";

export const ColumnResizeExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p.id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const rows = getRows(people);
  const [columns, setColumns] = useState(getColumns());
  const cells = generateCells(people, updatePerson);

  return (
    <div>
      <ReactGrid
        id="column-resize-example"
        styles={rgStyles}
        onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, setColumns)}
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
