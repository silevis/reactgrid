import React from "react";
import { StrictMode, useState } from "react";
import { NumberCell, ReactGrid, TextCell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, generateDataTable, RowDef, ColumnDef } from "./utils/examplesConfig";
import { handleRowReorder } from "./utils/handleRowReorder";

export const FillHandleExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const [rowDefs, setRowDefs] = useState<RowDef[]>(
    people.map((person, index) => ({
      id: person._id,
      rowIndex: index,
      height: 40 + index * 10,
      ...(index === 0 && { reorderable: false }), // make header row non-reorderable
    }))
  );

  const columnDefs: ColumnDef[] = Object.keys(peopleArr[0]).reduce(
    (acc: ColumnDef[], peopleKey: string, idx: number) => {
      if (peopleKey === "_id" || peopleKey === "position") return acc;
      const cellTemplate = peopleKey === "age" ? NumberCell : TextCell;
      return [...acc, { title: peopleKey, width: 100 * idx, position: idx, cellTemplate }];
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
