import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";
import TextCell from "../components/cellTemplates/TextCell";
import { HeaderCell } from "../components/cellTemplates/HeaderCell";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Column, Row } from "../types/PublicModel";
import { handleFill } from "./utils/handleFill";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleResizeColumn } from "./utils/handleResizeColumn";
import DateCell from "../components/cellTemplates/DateCell";

interface CellData {
  text?: string;
  date?: Date;
}

const ROW_COUNT = 8;
const COLUMN_COUNT = 6;

export const GridWithHeaders = () => {
  const [columns, setColumns] = useState<Array<Column<string>>>(
    Array.from({ length: COLUMN_COUNT }).map((_, j) => ({
      id: j.toString(),
      width: "150px",
    }))
  );
  const [rows] = useState<Array<Row<string>>>(
    Array.from({ length: ROW_COUNT }).map((_, j) => ({
      id: j.toString(),
      height: "50px",
    }))
  );

  const [gridData, setGridData] = useState<(CellData | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 3 && j === 3) return null;
        if (i === 2 && j === 2) return null;
        if (i === 0) {
          return { text: `title ${j + 1}` };
        }

        if (i === 2 && j === 1) {
          return { date: new Date() };
        }
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

        if (rowIndex === 0) {
          setCell(rowIndex.toString(), columnId, HeaderCell, {
            text: val?.text,
            style: {
              backgroundColor: "#fcff91",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            },
          });
          return;
        }

        if (val === null) return;

        setCell(rowIndex.toString(), columnId, TextCell, {
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

    const realColIdx = columns.findIndex((col) => col.id === "1");

    setCell("3", "2", TextCell, { value: "text" ?? "", reverse: true, onTextChanged: () => null }, { colSpan: 2 });

    setCell(
      "2",
      "1",
      DateCell,
      {
        value: gridData[2][realColIdx]?.date,
        onDateChanged: (newDate) => {
          setGridData((prev) => {
            const next = [...prev];
            next[2][realColIdx] = newDate;
            return next;
          });
        },
      },
      { colSpan: 2 }
    );
  });

  return (
    <div className="rgScrollableContainer" style={{ height: "100%", overflow: "auto" }}>
      <ReactGrid
        id="grid-with-headers"
        onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setGridData)}
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setGridData)
        }
        enableColumnSelection
        onResizeColumn={(width, columnId) => handleResizeColumn(width, columnId, cellMatrix, setColumns)}
        minColumnWidth={100}
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
