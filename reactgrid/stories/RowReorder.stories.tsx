import React from "react";
import { StrictMode, useState } from "react";
import { NumberCell, ReactGrid, TextCell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, generateDataTable, ColumnDef } from "./utils/examplesConfig";
import { handleRowReorder } from "./utils/handleRowReorder";

export const RowReorderExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const columnDefs: ColumnDef[] = Object.keys(peopleArr[0]).reduce(
    (acc: ColumnDef[], peopleKey: string, idx: number) => {
      if (["_id", "position"].includes(peopleKey)) return acc;
      const cellTemplate = peopleKey === "age" ? NumberCell : TextCell;
      return [...acc, { title: peopleKey, width: 100 * idx, cellTemplate }];
    },
    []
  );

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p._id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const { rows, columns, cells } = generateDataTable(people, updatePerson, columnDefs);

  return (
    <div>
      <ReactGrid
        id="row-reorder-example"
        styles={rgStyles}
        enableRowSelectionOnFirstColumn
        onRowReorder={(selectedRowIndexes, destinationRowIdx) => {
          handleRowReorder(people, selectedRowIndexes, destinationRowIdx, updatePerson);
        }}
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
