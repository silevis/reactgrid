import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { cellMatrixBuilder } from "../lib/utils/cellMatrixBuilder";
import { TextCell } from "../lib/cellTemplates/TextCell";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { Column, Row } from "../lib/types/PublicModel";
import { handleFill } from "./utils/handleFill";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleResizeColumn } from "./utils/handleResizeColumn";
import { handleRowReorder } from "./utils/handleRowReorder";
import { HeaderCell } from "./cellTemplates/HeaderCell";
import React from "react";
import { DateCell } from "./cellTemplates/DateCell";

interface CellData {
  type: "text" | "number" | "date";
  value: string | number | Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: React.ComponentType<any>;
  style?: React.CSSProperties;

  rowSpan?: number;
  colSpan?: number;

  isFocusable?: boolean;
  isSelectable?: boolean;
}

const ROW_COUNT = 4;
const COLUMN_COUNT = 4;

export const SpannedHeaders = () => {
  const [columns, setColumns] = useState<Array<Column>>(
    Array.from({ length: COLUMN_COUNT }).map((_, j) => {
      if (j === 2)
        return {
          id: j.toString(),
          width: "200px",
          resizable: true,
          reorderable: true,
          minWidth: 150,
        };

      return {
        id: j.toString(),
        width: "150px",
        resizable: true,
        reorderable: true,
        minWidth: 50,
      };
    })
  );
  const [rows, setRows] = useState<Array<Row>>(
    Array.from({ length: ROW_COUNT }).map((_, j) => {
      if (j === 0) return { id: j.toString(), height: "50px", reorderable: false };
      return { id: j.toString(), height: "50px", reorderable: true };
    })
  );

  const [gridData, setGridData] = useState<(CellData | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 0 && j === 3) return null;
        if (i === 2 && j === 2) return null;
        if (i === 3 && j === 3) return null;

        if (i === 0) {
          if (j === 2) {
            return {
              type: "text",
              value: `title ${j + 1}`,
              template: HeaderCell,
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
            type: "text",
            value: `title ${j + 1}`,
            template: HeaderCell,
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
            type: "text",
            value: "text",
            template: TextCell,
            colSpan: 2,
          };
        }
        if (i === 2 && j === 1) {
          return {
            type: "text",
            value: `[${i.toString()}:${j.toString()}]`,
            template: TextCell,
            colSpan: 2,
          };
        }

        return {
          type: "text",
          value: `[${i.toString()}:${j.toString()}]`,
          template: TextCell,
        };
      });
    })
  );

  const cellMatrix = cellMatrixBuilder(rows, columns, ({ setCell }) => {
    gridData.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell === null) return;

        setCell(
          rowIdx,
          colIdx,
          cell.template,
          {
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
            ...(cell?.rowSpan && { rowSpan: cell.rowSpan }),
            ...(cell?.colSpan && { colSpan: cell.colSpan }),
            ...(cell?.isFocusable === false && { isFocusable: cell.isFocusable }),
          }
        );
      });
    });
  });

  console.log("cellMatrix", cellMatrix);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <ReactGrid
        id="grid-with-headers"
        onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setGridData)}
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setGridData)
        }
        onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
          handleRowReorder(selectedRowIndexes, destinationRowIdx, setRows, setGridData)
        }
        enableColumnSelectionOnFirstRow
        enableRowSelectionOnFirstColumn
        onResizeColumn={(width, columnId) => handleResizeColumn(width, columnId, cellMatrix, setColumns)}
        stickyTopRows={1}
        initialFocusLocation={{ rowIndex: 1, colIndex: 0 }}
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
