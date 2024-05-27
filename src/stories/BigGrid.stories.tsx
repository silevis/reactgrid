import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import TextCell from "../components/cellTemplates/TextCell";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";
import NumberCell from "../components/cellTemplates/NumberCell";
import DateCell from "../components/cellTemplates/DateCell";
import { Column, Row } from "../types/PublicModel";
import { onFillHandle } from "./utils/onFillHandle";
import { onCutHandler } from "./utils/onCutHandler";
import { onPasteHandler } from "./utils/onPasteHandler";
import { onCopyHandler } from "./utils/onCopyHandler";
import { onColumnReorder } from "./utils/onColumnReorder";
import { onResizeColumn } from "./utils/onResizeColumn";

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
    }))
  );
  const [rows, serRows] = useState<Array<Row<string>>>(
    Array.from({ length: ROW_COUNT }).map((_, j) => ({
      id: j.toString(),
      height: "max-content",
    }))
  );

  const [data, setData] = useState<(CellData | null)[][]>(
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
    data.forEach((row, rowIndex) => {
      row.forEach((val, columnIndex) => {
        const columnId = columns[columnIndex].id; // necessary for column reordering
        if (val === null) return;

        setCell(rowIndex.toString(), columnId, TextCell, {
          value: val?.text,
          onTextChanged: (data) => {
            setData((prev) => {
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

    setCell(
      "1",
      "3",
      DateCell,
      {
        value: data[1][3]?.date,
        onDateChanged: (newDate) => {
          setData((prev) => {
            const next = [...prev];
            next[1][3] = newDate;
            return next;
          });
        },
      },
      { colSpan: 2 }
    );

    setCell("0", "0", NumberCell, {
      value: data[0][0]?.number ?? 0,
      validator: (value) => !isNaN(value),
      errorMessage: "ERR",
      format: myNumberFormat,
      hideZero: true,
      onValueChanged: (newNumber) => {
        setData((prev) => {
          const next = [...prev];
          next[0][0]!.number = newNumber;
          return next;
        });
      },
    });

    setCell(
      "2",
      "3",
      NumberCell,
      {
        value: data[2][3]?.number ?? 0,
        validator: (value) => !isNaN(value),
        errorMessage: "ERR",
        format: myNumberFormat,
        hideZero: true,
        onValueChanged: (newNumber) => {
          setData((prev) => {
            const next = [...prev];
            next[2][3]!.number = newNumber;
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
      { value: data[3][6]?.text ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 2, rowSpan: 2 }
    );
    setCell(
      "5",
      "4",
      TextCell,
      { value: data[5][4]?.text ?? "", reverse: true, onTextChanged: () => null },
      { rowSpan: 2 }
    );
    setCell(
      "5",
      "5",
      TextCell,
      { value: data[5][5]?.text ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 3 }
    );
    setCell(
      "6",
      "6",
      TextCell,
      { value: data[5][4]?.text ?? "", reverse: true, onTextChanged: () => null },
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
          onResizeColumn={(width, columnId) => onResizeColumn(width, columnId, cellMatrix, setColumns)}
          {...cellMatrix}
          onColumnReorder={(selectedColIndexes, destinationColIdx) =>
            onColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setData)
          }
          minColumnWidth={100}
          enableColumnSelection
          onAreaSelected={(selectedArea) => {}}
          onFillHandle={(selectedArea, fillRange) => onFillHandle(selectedArea, fillRange, setData)}
          onCut={(selectedArea) => onCutHandler(data, selectedArea, setData)}
          onPaste={(selectedArea, pastedData) => onPasteHandler(selectedArea, pastedData, setData)}
          onCopy={(selectedArea) => onCopyHandler(data, selectedArea)}
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
