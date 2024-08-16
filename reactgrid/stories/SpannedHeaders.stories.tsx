import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { TextCell } from "../lib/cellTemplates/TextCell";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { CellData, Column, Row } from "../lib/types/PublicModel";
import { handleFill } from "./utils/handleFill";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleRowReorder } from "./utils/handleRowReorder";
import React from "react";
import { HeaderCell } from "../lib/main";

const ROW_COUNT = 4;
const COLUMN_COUNT = 4;

export const SpannedHeaders = () => {
  const [cells, setCells] = useState<CellData[]>(
    Array.from({ length: ROW_COUNT })
      .flatMap((_, i) =>
        Array.from({ length: COLUMN_COUNT }).map((_, j) => {
          if (i === 0 && j === 3) return null;
          if (i === 2 && j === 2) return null;
          if (i === 3 && j === 3) return null;

          if (i === 0) {
            if (j === 2) {
              return {
                rowIndex: i,
                colIndex: j,
                Template: HeaderCell,
                props: {
                  value: `title ${j + 1}`,
                },
                style: {
                  backgroundColor: "#fcff91",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                },
                isFocusable: false,
                colSpan: 2,
              };
            }

            return {
              rowIndex: i,
              colIndex: j,
              props: { value: `title ${j + 1}` },
              Template: HeaderCell,
              style: {
                backgroundColor: "#fcff91",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              },
              isFocusable: false,
            };
          }

          if (i === 3 && j === 2) {
            return {
              rowIndex: i,
              colIndex: j,
              props: { value: "text" },
              value: "text",
              Template: TextCell,
              colSpan: 2,
            };
          }
          if (i === 2 && j === 1) {
            return {
              rowIndex: i,
              colIndex: j,
              props: { value: `[${i.toString()}:${j.toString()}]` },
              Template: TextCell,
              colSpan: 2,
            };
          }

          return {
            rowIndex: i,
            colIndex: j,
            props: { value: `[${i.toString()}:${j.toString()}]` },
            Template: TextCell,
          };
        })
      )
      .filter((cell) => cell !== null)
  );

  const [columns, setColumns] = useState<Column[]>([
    { colIndex: 0, width: 200 },
    { colIndex: 1, width: 200 },
    { colIndex: 2, width: 200 },
    { colIndex: 3, width: 200 },
  ]);
  const [rows, setRows] = useState<Row[]>([
    { rowIndex: 0, height: 50 },
    { rowIndex: 1, height: 50 },
    { rowIndex: 2, height: 50 },
    { rowIndex: 3, height: 50 },
  ]);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <ReactGrid
        id="spanned-headers-example"
        onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setCells)}
        onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
          handleRowReorder(selectedRowIndexes, destinationRowIdx, setCells, setRows)
        }
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setCells, setColumns)
        }
        enableColumnSelectionOnFirstRow
        enableRowSelectionOnFirstColumn
        // onResizeColumn={handleResizeColumn}
        columns={columns}
        rows={rows}
        onCellChanged={(cellLocation, newValue) => {
          setCells((prev) => {
            const next = [...prev];
            const cell = next.find(
              (cell) => cell.rowIndex === cellLocation.rowIndex && cell.colIndex === cellLocation.colIndex
            );
            if (cell && cell.props !== undefined) {
              cell.props.value = newValue;
            }
            return next;
          });
        }}
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
