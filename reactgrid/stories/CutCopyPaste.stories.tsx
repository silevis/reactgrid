import React, { StrictMode, useState } from "react";
import { Cell, NonEditableCell, NumberCell, ReactGrid, Row, TextCell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { ColumnDef, peopleArr, rgStyles } from "./utils/examplesConfig";
import { handleCopy } from "./utils/handleCopy";
import { handleCut } from "./utils/handleCut";
import { handlePaste } from "./utils/handlePaste";

export const CutCopyPasteExample = () => {
  const [people, setPeople] = useState(peopleArr);

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

  const gridRows: Row[] = Array.from({ length: people.length + 1 }, (_, i) => ({
    rowIndex: i,
    height: 40,
  }));

  const gridColumns = columnDefs.map((col, index) => ({
    colIndex: index,
    width: col.width,
  }));

  const gridCells: Cell[] = [];

  gridRows.forEach((row, rowIndex) => {
    const personRowIndex = row.rowIndex;

    if (rowIndex === 0) {
      columnDefs.forEach((col, colIndex) => {
        gridCells.push({
          rowIndex,
          colIndex,
          Template: NonEditableCell,
          props: {
            value: col.title,
            style: {
              backgroundColor: "#55bc71",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            },
          },
        });
      });
    } else {
      const personCells = columnDefs.map((col) => {
        const numberCellProps = {
          onValueChanged: (newValue) => {
            updatePerson(people[personRowIndex - 1]._id, col.title, newValue);
          },
          value: people[personRowIndex - 1][col.title.toLowerCase()],
        };

        const textCellProps = {
          text: people[personRowIndex - 1][col.title.toLowerCase()],
          onTextChanged: (newText: string) => {
            updatePerson(people[personRowIndex - 1]._id, col.title, newText);
          },
        };

        return {
          Template: col.cellTemplate,
          props: col.title === "age" ? numberCellProps : textCellProps,
        };
      });

      columnDefs.forEach((_, colIndex) => {
        gridCells.push({
          rowIndex,
          colIndex,
          ...personCells[colIndex],
        });
      });
    }
  });

  return (
    <div>
      <ReactGrid
        id="cut-copy-paste-example"
        styles={rgStyles}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        rows={gridRows}
        columns={gridColumns}
        cells={gridCells}
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
