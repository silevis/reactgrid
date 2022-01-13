import { Location, GridColumn, Range, GridRow, Id } from "../../core";
import { ProState } from "../Model/ProState";
import { newLocation } from "./newLocation";

export function resetSelection(state: ProState, location: Location): ProState {
  return {
    ...state,
    activeSelectedRangeIdx: 0,
    selectedRanges: [state.cellMatrix.getRange(location, location)],
    selectedIndexes: [],
    selectedIds: [],
    selectionMode: "range",
  };
}

export function selectRange(
  state: ProState,
  range: Range,
  incremental: boolean
): ProState {
  return {
    ...state,
    selectionMode: "range",
    selectedRanges: (incremental && state.selectionMode === "range"
      ? state.selectedRanges
      : []
    ).concat([range]),
    selectedIndexes: [],
    selectedIds: [],
    activeSelectedRangeIdx:
      incremental && state.selectionMode === "range"
        ? state.selectedRanges.length
        : 0,
  };
}

export function updateActiveSelectedRange(
  state: ProState,
  range: Range
): ProState {
  return {
    ...state,
    selectionMode: "range",
    // replace active selected range in selectedRanges
    selectedRanges: Object.assign([], state.selectedRanges, {
      [state.activeSelectedRangeIdx]: range,
    }),
    selectedIndexes: [],
    selectedIds: [],
  };
}

export function selectOneColumn(
  state: ProState,
  col: GridColumn,
  incremental: boolean
): ProState {
  return {
    ...state,
    selectionMode: "column",
    selectedIndexes: (incremental && state.selectionMode === "column"
      ? state.selectedIndexes
      : []
    ).concat(col.idx),
    selectedIds: (incremental && state.selectionMode === "column"
      ? state.selectedIds
      : []
    ).concat(col.columnId),
  };
}

export function unSelectOneColumn(state: ProState, col: GridColumn): ProState {
  const updatedIndexes = state.selectedIndexes.filter(
    (idx: number) => idx !== col.idx
  );
  const updatedIds = state.selectedIds.filter((id: Id) => id !== col.columnId);

  return {
    ...state,
    selectionMode: "column",
    selectedIndexes: updatedIndexes,
    selectedIds: updatedIds,
  };
}

export function selectMultipleColumns(
  state: ProState,
  firstCol: GridColumn,
  lastCol: GridColumn,
  incremental?: boolean
): ProState {
  const firstRow = state.cellMatrix.first.row;
  const lastRow = state.cellMatrix.last.row;
  const range = state.cellMatrix.getRange(
    newLocation(firstRow, firstCol),
    newLocation(lastRow, lastCol)
  );

  return {
    ...state,
    selectionMode: "column",
    selectedIndexes: incremental
      ? state.selectedIndexes.concat(range.columns.map((col) => col.idx))
      : range.columns.map((col) => col.idx),
    selectedIds: incremental
      ? state.selectedIds.concat(range.columns.map((col) => col.columnId))
      : range.columns.map((col) => col.columnId),
  };
}

export function selectOneRow(
  state: ProState,
  row: GridRow,
  incremental: boolean
): ProState {
  return {
    ...state,
    selectionMode: "row",
    selectedIndexes: (incremental && state.selectionMode === "row"
      ? state.selectedIndexes
      : []
    ).concat(row.idx),
    selectedIds: (incremental && state.selectionMode === "row"
      ? state.selectedIds
      : []
    ).concat(row.rowId),
  };
}

export function unSelectOneRow(state: ProState, row: GridRow): ProState {
  const updatedIndexes = state.selectedIndexes.filter(
    (idx: number) => idx !== row.idx
  );
  const updatedIds = state.selectedIds.filter((id: Id) => id !== row.rowId);

  return {
    ...state,
    selectionMode: "row",
    selectedIndexes: updatedIndexes,
    selectedIds: updatedIds,
  };
}

export function selectMultipleRows(
  state: ProState,
  firstRow: GridRow,
  lastRow: GridRow,
  incremental?: boolean
): ProState {
  const firstCol = state.cellMatrix.first.column;
  const lastCol = state.cellMatrix.last.column;
  const range = state.cellMatrix.getRange(
    newLocation(firstRow, firstCol),
    newLocation(lastRow, lastCol)
  );

  return {
    ...state,
    selectionMode: "row",
    selectedIndexes: incremental
      ? state.selectedIndexes.concat(range.rows.map((row) => row.idx))
      : range.rows.map((row) => row.idx),
    selectedIds: incremental
      ? state.selectedIds.concat(range.rows.map((row) => row.rowId))
      : range.rows.map((row) => row.rowId),
  };
}
