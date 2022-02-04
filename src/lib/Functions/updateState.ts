import { GridRow, GridColumn } from "../../core";
import { State } from "../Model/State";
import { newLocation } from "./newLocation";

export function updateSelectedRows(state: State): State {
  const firstCol = state.cellMatrix.first.column;
  const lastCol = state.cellMatrix.last.column;
  // TODO this filter is very inefficient for big tables
  const updatedRows = state.cellMatrix.rows
    .filter((r) => state.selectedIds.includes(r.rowId))
    .sort((a, b) => a.idx - b.idx);
  const rows = groupedRows(updatedRows);
  const ranges = rows.map((row) =>
    state.cellMatrix.getRange(
      newLocation(row[0], firstCol),
      newLocation(row[row.length - 1], lastCol)
    )
  );
  let activeSelectedRangeIdx = state.selectedRanges.length - 1;

  if (state.focusedLocation) {
    ranges.forEach((range, idx) => {
      range.rows.forEach((row) => {
        if (state.focusedLocation?.row.rowId === row.rowId) {
          activeSelectedRangeIdx = idx;
        }
      });
    });
  }

  return {
    ...state,
    selectionMode: "row",
    activeSelectedRangeIdx,
    selectedRanges: [...ranges],
    selectedIndexes: updatedRows.map((row) => row.idx),
    selectedIds: updatedRows.map((row) => row.rowId),
  };
}

export function updateSelectedColumns(state: State): State {
  const firstRow = state.cellMatrix.first.row;
  const lastRow = state.cellMatrix.last.row;
  // TODO this filter is very inefficient for big tables
  const updatedColumns = state.cellMatrix.columns
    .filter((r) => state.selectedIds.includes(r.columnId))
    .sort((a, b) => a.idx - b.idx);
  const columns = groupedColumns(updatedColumns);
  const ranges = columns.map((arr) =>
    state.cellMatrix.getRange(
      newLocation(firstRow, arr[0]),
      newLocation(lastRow, arr[arr.length - 1])
    )
  );
  let activeSelectedRangeIdx = state.selectedRanges.length - 1;

  if (state.focusedLocation) {
    ranges.forEach((range, idx) => {
      range.columns.forEach((col) => {
        if (state.focusedLocation?.column.columnId === col.columnId) {
          activeSelectedRangeIdx = idx;
        }
      });
    });
  }

  return {
    ...state,
    selectionMode: "column",
    activeSelectedRangeIdx,
    selectedRanges: [...ranges],
    selectedIndexes: updatedColumns.map((col) => col.idx),
    selectedIds: updatedColumns.map((col) => col.columnId),
  };
}

const groupedRows = (array: GridRow[]) => {
  const grouped: GridRow[][] = [];
  let sortIndex = 0;
  array.forEach((current: GridRow, index) => {
    if (!array[index - 1]) {
      grouped.push([current]);
      return;
    }
    const prev: GridRow = array[index - 1];
    if (current.idx - prev.idx === 1) {
      if (!grouped[sortIndex]) {
        grouped.push([prev, current]);
      } else {
        grouped[sortIndex].push(current);
      }
    } else {
      grouped.push([current]);
      sortIndex += 1;
    }
  });
  return grouped;
};

const groupedColumns = (array: GridColumn[]) => {
  const grouped: GridColumn[][] = [];
  let sortIndex = 0;
  array.forEach((current: GridColumn, index) => {
    if (!array[index - 1]) {
      grouped.push([current]);
      return;
    }
    const prev: GridColumn = array[index - 1];
    if (current.idx - prev.idx === 1) {
      if (!grouped[sortIndex]) {
        grouped.push([prev, current]);
      } else {
        grouped[sortIndex].push(current);
      }
    } else {
      grouped.push([current]);
      sortIndex += 1;
    }
  });
  return grouped;
};
