import React from "react";
import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../../lib/components/ReactGrid";
import { ErrorBoundary } from "../../lib/components/ErrorBoundary";
import { handleCut } from "../utils/handleCut";
import { handlePaste } from "../utils/handlePaste";
import { handleCopy } from "../utils/handleCopy";
import { testStyles, styledRanges, employeesArr, generateCells, ColumnDef, RowDef } from "../utils/bigGridConfig";
import { GridApi } from "../components/GridApi";
import { handleFill } from "../utils/handleFill";
import { NumberCell, TextCell } from "../../lib/main";
import { handleColumnReorder } from "../utils/handleColumnReorder";
import { handleRowReorder } from "../utils/handleRowReorder";
import { handleResizeColumn } from "../utils/handleResizeColumn";

export const BigGrid = () => {
  const [employees, setEmployees] = useState(employeesArr);

  const [columnDefs, setColumnDefs] = useState<ColumnDef[]>(
    Object.keys(employees[0]).reduce((acc: ColumnDef[], peopleKey: string) => {
      if (["_id", "position"].includes(peopleKey)) return acc;
      const cellTemplate = peopleKey === "age" || peopleKey === "balance" ? NumberCell : TextCell;
      return [...acc, { title: peopleKey, width: 100, cellTemplate }];
    }, [])
  );

  const updatePerson = (id, key, newValue) => {
    setEmployees((prev) => {
      return prev.map((p) => (p._id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const { rows, columns, cells } = generateCells(employees, updatePerson, columnDefs);

  const [toggleRanges, setToggleRanges] = useState(false);

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          stickyTopRows={1}
          stickyLeftColumns={2}
          stickyRightColumns={2}
          stickyBottomRows={2}
          styles={testStyles}
          styledRanges={toggleRanges ? styledRanges : []}
          onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, setColumnDefs)}
          onRowReorder={(selectedRowIndexes, destinationRowIdx) => {
            handleRowReorder(employees, selectedRowIndexes, destinationRowIdx, updatePerson);
          }}
          onColumnReorder={(selectedColIndexes, destinationColIdx) =>
            handleColumnReorder(selectedColIndexes, destinationColIdx, setColumnDefs)
          }
          enableColumnSelectionOnFirstRow
          enableRowSelectionOnFirstColumn
          rows={rows}
          columns={columns}
          cells={cells}
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
