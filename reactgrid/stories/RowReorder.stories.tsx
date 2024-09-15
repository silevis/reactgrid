import React from "react";
import { StrictMode, useState } from "react";
import { NumberCell, ReactGrid, TextCell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, generateDataTable, RowDef, ColumnDef } from "./utils/examplesConfig";
import { handleRowReorder } from "./utils/handleRowReorder";

export const RowReorderExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const [rowDefs, setRowDefs] = useState<RowDef[]>(
    Array.from({ length: people.length + 1 }, (_, i) => ({
      rowIndex: i,
      height: 40,
      ...(i === 0 && { reorderable: false }), // make header row non-reorderable
    }))
  );

  const columnDefs: ColumnDef[] = Object.keys(peopleArr[0]).reduce(
    (acc: ColumnDef[], peopleKey: string, idx: number) => {
      if (peopleKey === "_id") return acc;
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

  const { rows, columns, cells } = generateDataTable(people, updatePerson, rowDefs, columnDefs);

  return (
    <div>
      <ReactGrid
        id="row-reorder-example"
        styles={rgStyles}
        enableRowSelectionOnFirstColumn
        onRowReorder={(selectedRowIndexes, destinationRowIdx) => {
          handleRowReorder(selectedRowIndexes, destinationRowIdx, setRowDefs);
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
