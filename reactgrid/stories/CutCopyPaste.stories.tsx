import React, { StrictMode, useState } from "react";
import { Column, ReactGrid, Row } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { generateCells, peopleArr, rgStyles } from "./utils/examplesConfig";
import { handleResizeColumn } from "./utils/handleResizeColumn";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleRowReorder } from "./utils/handleRowReorder";
// import { handleCut } from "./utils/handleCut";
// import { handlePaste } from "./utils/handlePaste";
// import { handleRowReorder } from "./utils/handleRowReorder";

export const CutCopyPasteExample = () => {
  const [rows, setRows] = useState<Row[]>([
    { rowIndex: 0, initialRowIndex: 0, height: 30, reorderable: false },
    { rowIndex: 1, initialRowIndex: 1, height: 30 },
    { rowIndex: 2, initialRowIndex: 2, height: 30 },
    { rowIndex: 3, initialRowIndex: 3, height: 30 },
    { rowIndex: 4, initialRowIndex: 4, height: 30 },
  ]);

  const [columns, setColumns] = useState<Column[]>([
    { colIndex: 0, initialColIndex: 0, width: 100 },
    { colIndex: 1, initialColIndex: 1, width: 50 },
    { colIndex: 2, initialColIndex: 2, width: 200 },
    { colIndex: 3, initialColIndex: 3, width: 100 },
  ]);

  const [people, setPeople] = useState(peopleArr);

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p._id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const cells = generateCells(people, rows, columns, updatePerson);

  console.log("cells", cells);

  return (
    <div>
      <ReactGrid
        id="cut-copy-paste-example"
        styles={rgStyles}
        enableRowSelectionOnFirstColumn
        enableColumnSelectionOnFirstRow
        onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
          handleRowReorder(selectedRowIndexes, destinationRowIdx, setRows)
        }
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns)
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
