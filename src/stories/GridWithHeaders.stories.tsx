import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";
import TextCell from "../components/cellTemplates/TextCell";
import { HeaderCell } from "../components/cellTemplates/HeaderCell";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Column, Row } from "../types/PublicModel";
import { onFillHandle } from "./utils/onFillHandle";

interface CellData {
  text?: string;
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
  const [rows, serRows] = useState<Array<Row<string>>>(
    Array.from({ length: ROW_COUNT }).map((_, j) => ({
      id: j.toString(),
      height: "50px",
    }))
  );

  const [gridData, setGridData] = useState<(CellData | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 0) {
          return { text: `title ${j + 1}` };
        }
        return {
          text: `[${i.toString()}:${j.toString()}]`,
        };
      });
    })
  );

  const cellMatrix = cellMatrixBuilder(rows, columns, ({ setCell }) => {
    gridData.forEach((row, i) => {
      row.forEach((val, j) => {
        if (i === 0) {
          setCell(i.toString(), j.toString(), HeaderCell, {
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

        setCell(i.toString(), j.toString(), TextCell, {
          value: val?.text,
          style: {},
          onTextChanged: (data) => {
            setGridData((prev) => {
              const next = [...prev];
              if (next[i][j] !== null) {
                next[i][j].text = data;
              }
              return next;
            });
          },
        });
      });
    });
  });

  return (
    <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
      <ReactGrid
        id="grid-with-headers"
        onFillHandle={(selectedArea, fillRange) => onFillHandle(selectedArea, fillRange, setGridData)}
        onColumnReorder={(sourceIndex, destinationIndex, columnId) => {}}
        enableColumnSelection
        onResizeColumn={(width, columnId) => {
          setColumns((prevColumns) => {
            return prevColumns.map((column) => {
              if (column.id === columnId) {
                return { ...column, width: `${width}px` };
              }
              return column;
            });
          });
        }}
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
