import React from "react";
import { StrictMode, useState } from "react";
import { cellMatrixBuilder } from "../lib/utils/cellMatrixBuilder";
import { Column, Row, TextCell, ReactGrid, NumberCell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { initialColumns, initialRows, CellData, headerRow, dataRows, rgStyles } from "./utils/examplesConfig";
import { handleRowReorder } from "./utils/handleRowReorder";
import { HeaderCell } from "./cellTemplates/HeaderCell";

export const RowReorderExample = () => {
  const [columns, setColumns] = useState<Array<Column>>(initialColumns);
  const [rows, setRows] = useState<Array<Row>>(initialRows);

  const [gridData, setGridData] = useState<(CellData | null)[][]>(
    [headerRow, ...dataRows].map((row, rowIdx) =>
      row.map((item, index) =>
        index === row.length - 1 && rowIdx !== 0
          ? { number: typeof item === "number" ? item : parseFloat(item) }
          : { text: item.toString() }
      )
    )
  );

  const cellMatrix = cellMatrixBuilder(rows, columns, ({ setCell }) => {
    gridData.forEach((row, rowIndex) => {
      row.forEach((val, columnIndex) => {
        const columnId = columns[columnIndex].id;
        const rowId = rows[rowIndex].id;

        if (val === null) return;

        if (rowIndex === 0) {
          setCell(
            rowId,
            columnId,
            HeaderCell,
            {
              text: val?.text,
              style: {
                backgroundColor: "#55bc71",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              },
            },
            { isFocusable: false, isSelectable: false }
          );
          return;
        }

        if (columnId === "5") {
          setCell(rowId, columnId, NumberCell, {
            value: gridData[rowIndex][columnIndex]?.number ?? 0,
            validator: (value) => !isNaN(value),
            errorMessage: "ERR",
            hideZero: true,
            onValueChanged: (newNumber) => {
              setGridData((prev) => {
                const next = [...prev];
                next[rowIndex][columnIndex] = { number: newNumber };
                return next;
              });
            },
          });
          return;
        }

        setCell(rowId, columnId, TextCell, {
          value: val?.text,
          style: { alignContent: "center" },
          onTextChanged: (data) => {
            setGridData((prev) => {
              const next = [...prev];
              if (next[rowIndex][columnIndex] !== null) {
                next[rowIndex][columnIndex].text = data;
              }
              return next;
            });
          },
        });
      });
    });
  });

  return (
    <div>
      <ReactGrid
        id="column-reorder-example"
        styles={rgStyles}
        enableRowSelectionOnFirstColumn
        onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
          handleRowReorder(selectedRowIndexes, destinationRowIdx, setRows, setGridData)
        }
        initialFocusLocation={{ rowId: "2", columnId: "1" }}
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
