import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { cellMatrixBuilder } from "../lib/utils/cellMatrixBuilder";
import { TextCell } from "../lib/cellTemplates/TextCell";
import { HeaderCell } from "../lib/cellTemplates/HeaderCell";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { Column, Row } from "../lib/types/PublicModel";
import { handleFill } from "./utils/handleFill";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleResizeColumn } from "./utils/handleResizeColumn";
import { DateCell } from "../lib/cellTemplates/DateCell";
import { handleRowReorder } from "./utils/handleRowReorder";

interface CellData {
  text?: string;
  date?: Date;
}

const ROW_COUNT = 4;
const COLUMN_COUNT = 4;

export const GridWithHeaders = () => {
  const [columns, setColumns] = useState<Array<Column<string>>>(
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
  const [rows, setRows] = useState<Array<Row<string>>>(
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
        if (i === 2 && j === 1) return { date: new Date() };

        if (i === 0) return { text: `title ${j + 1}` };

        return {
          text: `[${i.toString()}:${j.toString()}]`,
        };
      });
    })
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
                backgroundColor: "#fcff91",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              },
            },
            { isFocusable: false }
          );
          return;
        }

        setCell(rowId, columnId, TextCell, {
          value: val?.text,
          style: {},
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

    const realRowIdx = rows.findIndex((row) => row.id === "2");
    const realColIdx = columns.findIndex((col) => col.id === "1");

    setCell("3", "2", TextCell, { value: "text" ?? "", onTextChanged: () => null }, { colSpan: 2 });

    setCell("0", "2", TextCell, { value: "text" ?? "", onTextChanged: () => null }, { colSpan: 2 });

    setCell(
      "2",
      "1",
      DateCell,
      {
        value: gridData[realRowIdx][realColIdx]?.date,
        onDateChanged: (newDate) => {
          setGridData((prev) => {
            const next = [...prev];
            next[realRowIdx][realColIdx] = newDate;
            return next;
          });
        },
      },
      { colSpan: 2 }
    );
  });

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
