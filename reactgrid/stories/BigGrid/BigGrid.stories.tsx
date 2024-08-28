import React from "react";
import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../../lib/components/ReactGrid";
import { ErrorBoundary } from "../../lib/components/ErrorBoundary";
import { CellData, Column, Row } from "../../lib/types/PublicModel";
import { handleFill } from "../utils/handleFill";
import { handleCut } from "../utils/handleCut";
import { handlePaste } from "../utils/handlePaste";
import { handleCopy } from "../utils/handleCopy";
import { handleColumnReorder } from "../utils/handleColumnReorder";
import { handleRowReorder } from "../utils/handleRowReorder";
import { COLUMN_COUNT, ROW_COUNT, generateCellData, testStyles, styledRanges } from "../utils/bigGridConfig";
import { handleResizeColumn } from "../utils/handleResizeColumn";
import { GridApi } from "../components/GridApi";

export const BigGrid = () => {
  const [cells, setCells] = useState<CellData[]>(
    Array.from({ length: ROW_COUNT * COLUMN_COUNT }).reduce<CellData[]>((acc, _, index) => {
      const i = Math.floor(index / COLUMN_COUNT);
      const j = index % COLUMN_COUNT;
      const cellData = generateCellData(i, j);
      if (cellData !== null) acc.push(cellData);
      return acc;
    }, [])
  );

  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: ROW_COUNT }, (_, index) => ({
      rowIndex: index,
      height: 80,
    }))
  );

  const [columns, setColumns] = useState<Column[]>(
    Array.from({ length: COLUMN_COUNT }, (_, index) => ({
      colIndex: index,
      width: index % 2 === 0 ? 100 : 200,
    }))
  );

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
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
          cells={cells}
          stickyTopRows={2}
          stickyLeftColumns={2}
          stickyRightColumns={2}
          stickyBottomRows={2}
          styles={testStyles}
          styledRanges={styledRanges}
          onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, setColumns)}
          onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
            handleRowReorder(selectedRowIndexes, destinationRowIdx, setCells, setRows)
          }
          onColumnReorder={(selectedColIndexes, destinationColIdx) =>
            handleColumnReorder(selectedColIndexes, destinationColIdx, setCells, setColumns)
          }
          enableColumnSelectionOnFirstRow
          enableRowSelectionOnFirstColumn
          onAreaSelected={(selectedArea) => {}}
          rows={rows}
          columns={columns}
          onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setCells)}
          onCut={(selectedArea) => handleCut(cells, selectedArea, setCells)}
          onPaste={(selectedArea, pastedData) => handlePaste(selectedArea, pastedData, setCells)}
          onCopy={(selectedArea) => handleCopy(cells, selectedArea)}
          onCellFocused={(cellLocation) => {}}
        />
        <GridApi />
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
