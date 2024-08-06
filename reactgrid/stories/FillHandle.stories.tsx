import React, { StrictMode, useState } from "react";
import { cellMatrixBuilder } from "../lib/utils/cellMatrixBuilder";
import { Column, Row, ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { initialColumns, initialRows, CellData, rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleFill } from "./utils/handleFill";

export const FillHandleExample = () => {
  const [columns, setColumns] = useState<Array<Column>>(initialColumns);
  const [rows, setRows] = useState<Array<Row>>(initialRows);
  const [gridData, setGridData] = useState<(CellData | null)[][]>(initialGridData);

  const cells = cellMatrixBuilder(({ setCell }) => {
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
        id="fill-handle-example"
        styles={rgStyles}
        onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setGridData)}
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
