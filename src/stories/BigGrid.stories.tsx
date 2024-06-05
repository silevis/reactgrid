import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import TextCell from "../components/cellTemplates/TextCell";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";
import NumberCell from "../components/cellTemplates/NumberCell";
import DateCell from "../components/cellTemplates/DateCell";
import { Column, Row } from "../types/PublicModel";
import { handleFill } from "./utils/handleFill";
import { handleCut } from "./utils/handleCut";
import { handlePaste } from "./utils/handlePaste";
import { handleCopy } from "./utils/handleCopy";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleResizeColumn } from "./utils/handleResizeColumn";
import { handleRowReorder } from "./utils/handleRowReorder";

interface CellData {
  text?: string;
  number?: number;
  date?: Date;
}

const styledRanges = [
  {
    range: { start: { rowId: "0", columnId: "5" }, end: { rowId: "14", columnId: "12" } },
    styles: { background: "red", color: "yellow" },
  },
  {
    range: { start: { rowId: "7", columnId: "10" }, end: { rowId: "10", columnId: "14" } },
    styles: { background: "green", color: "purple" },
  },
];

const ROW_COUNT = 20;
const COLUMN_COUNT = 25;

const testStyles = {};

const myNumberFormat = new Intl.NumberFormat("pl", {
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currency: "PLN",
});

export const BigGrid = () => {
  const [columns, setColumns] = useState<Array<Column<string>>>(
    Array.from({ length: COLUMN_COUNT }).map((_, j) => ({
      id: j.toString(),
      width: 150,
      reorderable: true,
      resizable: true,
    }))
  );
  const [rows, setRows] = useState<Array<Row<string>>>(
    Array.from({ length: ROW_COUNT }).map((_, j) => ({
      id: j.toString(),
      height: "max-content",
      reorderable: true,
    }))
  );

  const [gridData, setGridData] = useState<(CellData | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 1 && j === 4) return null;
        if (i === 2 && j === 4) return null;
        if (i === 3 && j === 3) return null;
        if (i === 3 && j === 4) return null;

        if (i === 3 && j === 7) return null;
        if (i === 4 && j === 6) return null;
        if (i === 4 && j === 7) return null;

        if (i === 5 && j === 6) return null;
        if (i === 5 && j === 7) return null;

        if (i === 6 && j === 4) return null;

        if (i === 6 && j === 7) return null;
        if (i === 6 && j === 8) return null;

        if (i === 1 && j === 3) return { date: new Date() };

        if (i === 0 && j === 0) return { number: 100 };

        if (i === 2 && j === 3) return { number: 125 };

        return {
          text:
            `[${i.toString()}:${j.toString()}]` +
            [
              "Lorem ipsum dolor sit amet",
              "Reiciendis illum, nihil, ab officiis explicabo!",
              "Excepturi in adipisci omnis illo eveniet obcaecati!",
              "Doloremque, sit!",
            ][Math.floor(Math.random() * 4)],
        };
      });
    })
  );

  const cellMatrix = cellMatrixBuilder(rows, columns, ({ setCell }) => {
    gridData.forEach((row, rowIndex) => {
      row.forEach((val, columnIndex) => {
        const columnId = columns[columnIndex].id; // necessary for column reordering
        const rowId = rows[rowIndex].id; // necessary for row reordering
        if (val === null) return;

        setCell(rowId, columnId, TextCell, {
          value: val?.text,
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

    const realColIdx0 = columns.findIndex((col) => col.id === "0");
    const realColIdx3 = columns.findIndex((col) => col.id === "3");
    const realColIdx4 = columns.findIndex((col) => col.id === "4");
    const realColIdx5 = columns.findIndex((col) => col.id === "5");
    const realColIdx6 = columns.findIndex((col) => col.id === "6");

    const realRowIdx0 = rows.findIndex((row) => row.id === "0");
    const realRowIdx1 = rows.findIndex((row) => row.id === "1");
    const realRowIdx2 = rows.findIndex((row) => row.id === "2");
    const realRowIdx3 = rows.findIndex((row) => row.id === "3");
    const realRowIdx5 = rows.findIndex((row) => row.id === "5");
    const realRowIdx6 = rows.findIndex((row) => row.id === "6");

    setCell("0", "0", NumberCell, {
      value: gridData[realRowIdx0][realColIdx0]?.number ?? 0,
      validator: (value) => !isNaN(value),
      errorMessage: "ERR",
      format: myNumberFormat,
      hideZero: true,
      onValueChanged: (newNumber) => {
        setGridData((prev) => {
          const next = [...prev];
          next[realRowIdx0][realColIdx0] = { number: newNumber };
          return next;
        });
      },
    });

    setCell(
      "1",
      "3",
      DateCell,
      {
        value: gridData[realRowIdx1][realColIdx3]?.date,
        onDateChanged: (newDate) => {
          setGridData((prev) => {
            const next = [...prev];
            next[realRowIdx1][realColIdx3] = newDate;
            return next;
          });
        },
      },
      { colSpan: 2 }
    );

    setCell(
      "2",
      "3",
      NumberCell,
      {
        value: gridData[realRowIdx2][realColIdx3]?.number ?? 0,
        validator: (value) => !isNaN(value),
        errorMessage: "ERR",
        format: myNumberFormat,
        hideZero: true,
        onValueChanged: (newNumber) => {
          setGridData((prev) => {
            const next = [...prev];
            next[realRowIdx2][realColIdx3] = { number: newNumber };
            return next;
          });
        },
      },
      { colSpan: 2, rowSpan: 2 }
    );
    setCell(
      "3",
      "6",
      TextCell,
      { value: gridData[realRowIdx3][realColIdx6]?.text ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 2, rowSpan: 2 }
    );
    setCell(
      "5",
      "4",
      TextCell,
      { value: gridData[realRowIdx5][realColIdx4]?.text ?? "", reverse: true, onTextChanged: () => null },
      { rowSpan: 2 }
    );
    setCell(
      "5",
      "5",
      TextCell,
      { value: gridData[realRowIdx5][realColIdx5]?.text ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 3 }
    );
    setCell(
      "6",
      "6",
      TextCell,
      { value: gridData[realRowIdx6][realColIdx6]?.text ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 3 }
    );
  });

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          stickyTopRows={1}
          stickyLeftColumns={3}
          stickyRightColumns={2}
          stickyBottomRows={2}
          styles={testStyles}
          // styledRanges={styledRanges}
          onResizeColumn={(width, columnId) => handleResizeColumn(width, columnId, cellMatrix, setColumns)}
          {...cellMatrix}
          onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
            handleRowReorder(selectedRowIndexes, destinationRowIdx, setRows, setGridData)
          }
          onColumnReorder={(selectedColIndexes, destinationColIdx) =>
            handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setGridData)
          }
          minColumnWidth={100}
          enableColumnSelection
          enableRowSelection
          onAreaSelected={(selectedArea) => {}}
          onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setGridData)}
          onCut={(selectedArea) => handleCut(gridData, selectedArea, setGridData)}
          onPaste={(selectedArea, pastedData) => handlePaste(selectedArea, pastedData, setGridData)}
          onCopy={(selectedArea) => handleCopy(gridData, selectedArea)}
          onCellFocused={(cellLocation) => {}}
        />
      </div>
    </>
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
