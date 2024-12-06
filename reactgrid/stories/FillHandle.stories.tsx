import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, generateCells, getColumns, getRows } from "./utils/examplesConfig";
import { handleFill } from "./utils/handleFill";

export const FillHandleExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p.id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const rows = getRows(people);
  const columns = getColumns();
  const cells = generateCells(people, updatePerson);

  return (
    <div>
      <ReactGrid
        id="fill-handle-example"
        styles={rgStyles}
        stickyLeftColumns={1}
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
