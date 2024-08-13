import React from "react";
import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { CellData, Column, Row } from "../lib/types/PublicModel";
import { handleFill } from "./utils/handleFill";
import { handleCut } from "./utils/handleCut";
import { handlePaste } from "./utils/handlePaste";
import { handleCopy } from "./utils/handleCopy";
import { handleColumnReorder } from "./utils/handleColumnReorder";
import { handleRowReorder } from "./utils/handleRowReorder";
import { IndexedLocation } from "../lib/types/InternalModel";
import { handleResizeColumn } from "./utils/handleResizeColumn";
import { COLUMN_COUNT, ROW_COUNT, generateCellData, testStyles, styledRanges } from "./utils/bigGridConfig";

export const BigGrid = () => {
  const [columns, setColumns] = useState<Array<Column>>(
    Array.from({ length: COLUMN_COUNT }).map((_, j) => ({
      width: 150,
      reorderable: true,
      resizable: true,
    }))
  );

  const [rows, setRows] = useState<Array<Row>>(
    Array.from({ length: ROW_COUNT }).map((_, j) => {
      if (j === 0) return { height: "100px", reorderable: true };

      return { height: "max-content", reorderable: true };
    })
  );

  const [cells, setCells] = useState<CellData[]>(
    Array.from({ length: ROW_COUNT * COLUMN_COUNT }).reduce<CellData[]>((acc, _, index) => {
      const i = Math.floor(index / COLUMN_COUNT);
      const j = index % COLUMN_COUNT;
      const cellData = generateCellData(i, j);
      if (cellData !== null) acc.push(cellData);
      return acc;
    }, [])
  );

  console.log(cells);

  const [toggleRanges, setToggleRanges] = useState(false);

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          rows={rows}
          columns={columns}
          onCellChanged={(cellLocation: IndexedLocation, newValue) => {
            setCells((prev) => {
              const next = [...prev];

              const cell = next.find(
                (cell) => cell.rowIndex === cellLocation.rowIndex && cell.colIndex === cellLocation.colIndex
              );

              if (cell?.props !== undefined) {
                cell.props.value = newValue;
              }
              return next;
            });
          }}
          cells={cells}
          stickyTopRows={5}
          stickyLeftColumns={3}
          stickyRightColumns={3}
          stickyBottomRows={4}
          styles={testStyles}
          styledRanges={toggleRanges ? styledRanges : []}
          // onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, cells, setColumns)}
          onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
            handleRowReorder(selectedRowIndexes, destinationRowIdx, setRows, setCells)
          }
          onColumnReorder={(selectedColIndexes, destinationColIdx) =>
            handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns, setCells)
          }
          enableColumnSelectionOnFirstRow
          enableRowSelectionOnFirstColumn
          onAreaSelected={(selectedArea) => {}}
          onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setCells)}
          onCut={(selectedArea) => handleCut(cells, selectedArea, setCells)}
          onPaste={(selectedArea, pastedData) => handlePaste(selectedArea, pastedData, setCells)}
          // onCopy={(selectedArea) => handleCopy(cells, selectedArea)}
          onCellFocused={(cellLocation) => {}}
        />
        <button onClick={() => setToggleRanges((prev) => !prev)}>toggle ranges</button>
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
