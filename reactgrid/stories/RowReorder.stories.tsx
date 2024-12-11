import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, generateCells, getColumns, getRows } from "./utils/examplesConfig";
import { handleRowReorder } from "./utils/handleRowReorder";

export const RowReorderExample = () => {
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
        id="row-reorder-example"
        styles={rgStyles}
        enableRowSelectionOnFirstColumn
        onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
          handleRowReorder(people, selectedRowIndexes, destinationRowIdx, updatePerson)
        }
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
