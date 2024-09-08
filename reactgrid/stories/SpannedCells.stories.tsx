import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { TextCell } from "../lib/cellTemplates/TextCell";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { Cell, Column, Row } from "../lib/types/PublicModel";
import React from "react";
import { NonEditableCell } from "../lib/main";

// Example person data for the table cells
const peopleArr = [
  { name: "John Doe", age: 30, email: "john@example.com", company: "Acme" },
  { name: "Jane Smith", age: 25, email: "jane@example.com", company: "TechCorp" },
  { name: "Alice Johnson", age: 35, email: "alice@example.com", company: "InnovateX" },
  { name: "Bob Brown", age: 28, email: "bob@example.com", company: "Startup" },
];

// Updated SpannedHeaders component
export const SpannedCellsExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const updateCellValue = (rowIndex: number, key: string, newValue: string) => {
    setPeople((prevPeople) =>
      prevPeople.map((person, idx) => (idx !== rowIndex ? person : { ...person, [key]: newValue }))
    );
  };

  const generateCells = (rows: Row[], columns: Column[]) => {
    const cells: Cell[] = [];

    rows.forEach((row, rowIndex) => {
      // Header row with spanned headers
      if (rowIndex === 0) {
        columns.forEach((col, colIndex) => {
          if (colIndex === 2) {
            cells.push({
              rowIndex,
              colIndex,
              Template: NonEditableCell,
              props: {
                value: "Header 1",
                style: { backgroundColor: "#fcff91", textAlign: "center", fontWeight: "bold" },
              },
              colSpan: 1,
            });
          } else {
            cells.push({
              rowIndex,
              colIndex,
              Template: NonEditableCell,
              props: {
                value: colIndex === 0 ? "Header 2" : colIndex === 1 ? "Header 3" : "Header 4",
                style: { backgroundColor: "#fcff91", textAlign: "center", fontWeight: "bold" },
              },
            });
          }
        });
      } else {
        // Data rows with text cells
        columns.forEach((col, colIndex) => {
          const person = people[rowIndex - 1]; // Subtract 1 for zero-based header row

          if (colIndex === 2) {
            cells.push({
              rowIndex,
              colIndex,
              Template: TextCell,
              props: {
                text: person.company,
                onTextChanged: (newValue: string) => updateCellValue(rowIndex - 1, "company", newValue),
              },
              colSpan: 2,
            });
          } else {
            const key = colIndex === 0 ? "name" : colIndex === 1 ? "age" : "email";
            cells.push({
              rowIndex,
              colIndex,
              Template: TextCell,
              props: {
                text: person[key],
                onTextChanged: (newValue: string) => updateCellValue(rowIndex - 1, key, newValue),
              },
            });
          }
        });
      }
    });

    return cells;
  };

  const [columns] = useState<Column[]>([
    { colIndex: 0, width: 200 },
    { colIndex: 1, width: 100 },
    { colIndex: 2, width: 200 },
    { colIndex: 3, width: 200 },
  ]);

  const [rows] = useState<Row[]>([
    { rowIndex: 0, height: 50 },
    { rowIndex: 1, height: 50 },
    { rowIndex: 2, height: 50 },
    { rowIndex: 3, height: 50 },
    { rowIndex: 4, height: 50 },
  ]);

  const cells = generateCells(rows, columns);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <ReactGrid
        id="spanned-cells-example"
        enableColumnSelectionOnFirstRow
        enableRowSelectionOnFirstColumn
        columns={columns}
        rows={rows}
        stickyTopRows={1}
        initialFocusLocation={{ rowIndex: 1, colIndex: 0 }}
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
