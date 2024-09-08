import React from "react";
import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../../lib/components/ReactGrid";
import { ErrorBoundary } from "../../lib/components/ErrorBoundary";
import { Column, Row } from "../../lib/types/PublicModel";
import { handleCut } from "../utils/handleCut";
import { handlePaste } from "../utils/handlePaste";
import { handleCopy } from "../utils/handleCopy";
import { handleColumnReorder } from "../utils/handleColumnReorder";
import { handleRowReorder } from "../utils/handleRowReorder";
import { testStyles, styledRanges, employeesArr, generateCells, headers } from "../utils/bigGridConfig";
import { handleResizeColumn } from "../utils/handleResizeColumn";
import { GridApi } from "../components/GridApi";
import { handleFill } from "../utils/handleFill";

export const BigGrid = () => {
  const [employees, setEmployees] = useState(employeesArr);

  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: employees.length }, (_, index) => ({
      initialRowIndex: index,
      rowIndex: index,
      height: 30,
    }))
  );

  const [columns, setColumns] = useState<Column[]>(
    Array.from({ length: headers.length }, (_, index) => ({
      initialColIndex: index,
      colIndex: index,
      width: 100,
    }))
  );

  const updatePerson = (id, key, newValue) => {
    setEmployees((prev) => {
      return prev.map((p) => (p._id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const cells = generateCells(employees, updatePerson, rows, columns);

  const [toggleRanges, setToggleRanges] = useState(false);

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          cells={cells}
          stickyTopRows={1}
          stickyLeftColumns={2}
          stickyRightColumns={2}
          stickyBottomRows={2}
          styles={testStyles}
          styledRanges={toggleRanges ? styledRanges : []}
          onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, setColumns)}
          onRowReorder={(selectedRowIndexes, destinationRowIdx) =>
            handleRowReorder(selectedRowIndexes, destinationRowIdx, setRows)
          }
          onColumnReorder={(selectedColIndexes, destinationColIdx) =>
            handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns)
          }
          enableColumnSelectionOnFirstRow
          enableRowSelectionOnFirstColumn
          rows={rows}
          columns={columns}
          onFillHandle={handleFill}
          onCut={handleCut}
          onPaste={handlePaste}
          onCopy={handleCopy}
          onAreaSelected={(selectedArea) => {}}
          onCellFocused={(cellLocation) => {}}
        />
        <button onClick={() => setToggleRanges((prev) => !prev)}>toggle ranges</button>
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
