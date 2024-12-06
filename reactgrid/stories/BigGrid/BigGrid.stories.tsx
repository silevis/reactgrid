import React, { Dispatch, SetStateAction } from "react";
import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { ReactGrid } from "../../lib/components/ReactGrid";
import { ErrorBoundary } from "../../lib/components/ErrorBoundary";
import { testStyles, styledRanges, employeesArr, generateCells, ColumnDef, Employee } from "../utils/bigGridConfig";
import { GridApi } from "../components/GridApi";
import { handleFill } from "../utils/handleFill";
import { NumberCell, TextCell } from "../../lib/main";

export const BigGrid = () => {
  const [employees, setEmployees] = useState(employeesArr);

  const [columnDefs, setColumnDefs] = useState<ColumnDef[]>(
    Object.keys(employees[0]).reduce((acc: ColumnDef[], peopleKey: string) => {
      if (["_id", "position"].includes(peopleKey)) return acc;
      const cellTemplate = ["age", "balance", "latitude", "longitude"].includes(peopleKey) ? NumberCell : TextCell;
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
          stickyLeftColumns={2}
          stickyTopRows={2}
          stickyBottomRows={2}
          stickyRightColumns={2}
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
          onAreaSelected={(selectedArea) => {}}
          onCellFocused={(cellLocation) => {}}
        />
        <button onClick={() => setToggleRanges((prev) => !prev)}>toggle ranges</button>
        <GridApi />
      </div>
    </>
  );
};

const handleRowReorder = (
  peopleArr: Employee[],
  selectedRowIndexes: number[],
  destinationRowIdx: number,
  updatePerson: (id: string, key: string, newValue: number) => void
) => {
  const prevPeopleArr = [...peopleArr].sort((a, b) => a.position - b.position);

  // Adjust the destination index to account for the header row
  const adjustedDestinationIdx = destinationRowIdx - 1;
  const adjustedSelectedRowIdxs = selectedRowIndexes.map((rowIdx) => rowIdx - 1);

  const isReorderingUpwards = adjustedSelectedRowIdxs.some((rowIdx) => rowIdx > adjustedDestinationIdx);

  adjustedSelectedRowIdxs.forEach((rowIdx, index) => {
    if (adjustedDestinationIdx === 0) {
      prevPeopleArr[rowIdx].position = prevPeopleArr[adjustedDestinationIdx].position / 2 + index * 0.01;
    } else if (adjustedDestinationIdx === peopleArr.length - 1) {
      prevPeopleArr[rowIdx].position = prevPeopleArr[adjustedDestinationIdx].position + 1 + index * 0.01;
    } else if (isReorderingUpwards) {
      prevPeopleArr[rowIdx].position =
        (prevPeopleArr[adjustedDestinationIdx].position + prevPeopleArr[adjustedDestinationIdx - 1].position) / 2 +
        index * 0.01;
    } else {
      prevPeopleArr[rowIdx].position =
        (prevPeopleArr[adjustedDestinationIdx].position + prevPeopleArr[adjustedDestinationIdx + 1].position) / 2 +
        index * 0.01;
    }
  });

  prevPeopleArr.forEach((row) => {
    updatePerson(row._id, "position", row.position);
  });
};

const handleColumnReorder = (
  selectedColIndexes: number[],
  destinationColIdx: number,
  setColumns: React.Dispatch<React.SetStateAction<ColumnDef[]>>
) => {
  setColumns((prevColumns) => {
    const selectedColumns = prevColumns.filter((_, index) => selectedColIndexes.includes(index));
    const unselectedColumns = prevColumns.filter((_, index) => !selectedColIndexes.includes(index));

    const adjustedDestinationColIdx =
      selectedColIndexes[0] > destinationColIdx ? destinationColIdx : destinationColIdx - selectedColumns.length + 1;

    const newColumns = [
      ...unselectedColumns.slice(0, adjustedDestinationColIdx),
      ...selectedColumns,
      ...unselectedColumns.slice(adjustedDestinationColIdx),
    ];

    return newColumns;
  });
};

const handleResizeColumn = (
  newWidth: number,
  columnIndexes: number[],
  setColumns: Dispatch<SetStateAction<ColumnDef[]>>
) => {
  setColumns((prevColumns) => {
    const widthPerColumn = columnIndexes.length > 1 ? newWidth / columnIndexes.length : newWidth;

    return prevColumns.map((column, idx) => {
      if (columnIndexes.includes(idx)) {
        return { ...column, width: widthPerColumn };
      }

      return column;
    });
  });
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
