import React from "react";
import { StrictMode, useState } from "react";
import { cellMatrixBuilder } from "../lib/utils/cellMatrixBuilder";
import { Column, Row, ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { initialColumns, initialRows, CellData, rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";

export const ColumnReorderExample = () => {
  const [columns, setColumns] = useState<Array<Column>>(initialColumns);
  const [rows, setRows] = useState<Array<Row>>(initialRows);

  const [gridData, setGridData] = useState<(CellData | null)[][]>(initialGridData);

  const cellMatrix = cellMatrixBuilder(rows, columns, ({ setCell }) => {
    gridData.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell === null) return;

        setCell(
          rowIdx,
          colIdx,
          cell.template,
          {
            ...(cell.hideZero && { hideZero: cell.hideZero }),
            ...(cell.errorMessage && { errorMessage: cell.errorMessage }),
            ...(cell.validator && { validator: cell.validator }),
            value: cell.value,
            style: cell.style,
            onValueChanged: (data) => {
              setGridData((prev) => {
                const next = [...prev];
                if (next[rowIdx][colIdx] !== null) {
                  next[rowIdx][colIdx].value = data;
                }
                return next;
              });
            },
          },
          {
            ...(cell?.isFocusable === false && { isFocusable: cell.isFocusable }),
            ...(cell?.isSelectable === false && { isSelectable: cell.isSelectable }),
          }
        );
      });
    });
  });

  return (
    <div>
      <ReactGrid
        id="column-reorder-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setGridData)
        }
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        {...cellMatrix}
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
