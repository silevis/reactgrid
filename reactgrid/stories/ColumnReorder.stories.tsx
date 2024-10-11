import React from "react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, getRows, getColumns, generateCells } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleResizeColumn } from "./utils/handleResizeColumn";

export const ColumnReorderExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p.id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const rows = getRows(people);
  const [columns, setColumns] = useState(getColumns());
  const [cells, setCells] = useState(generateCells(people, updatePerson));

  return (
    <div>
      <ReactGrid
        id="column-reorder-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setCells)
        }
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
