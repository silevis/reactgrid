import { FocusedCell } from "../types/InternalModel";
import { getOriginCell, isCellSpanned } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";

const absoluteLocation = {
  rowIndex: -1,
  colIndex: -1,
};

export const moveFocusUp = (store: ReactGridStore, currentFocus: FocusedCell): ReactGridStore => {
  if (currentFocus.rowIndex === 0) return store;

  const colIndex =
    "colSpan" in currentFocus && absoluteLocation.colIndex !== -1 ? absoluteLocation.colIndex : currentFocus.colIndex;

  // Look for the next focusable cell in the rows above the current focus
  for (let rowIdx = currentFocus.rowIndex - 1; rowIdx >= 0; rowIdx--) {
    const nextPossibleLocation = store.getCellByIndexes(rowIdx, colIndex);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex(row => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex(col => col.id === originCell.colId);

      if (originCell.rowSpan ?? 1 > 1) absoluteLocation.rowIndex = originRowIndex;
      else absoluteLocation.rowIndex = rowIdx;
      absoluteLocation.colIndex = colIndex;

      return { ...store, focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex } };
    }
  }

  return store;
};

export const moveFocusRight = (store: ReactGridStore, currentFocus: FocusedCell): ReactGridStore => {
  if (currentFocus.colIndex === store.columns.length - 1) return store;

  const rowIndex =
    "rowSpan" in currentFocus && absoluteLocation.rowIndex !== -1 ? absoluteLocation.rowIndex : currentFocus.rowIndex;

  // Look for the next focusable cell in the rows below the current focus
  for (let colIdx = currentFocus.colIndex + (currentFocus.colSpan ?? 1); colIdx < store.columns.length; colIdx++) {
    const nextPossibleLocation = store.getCellByIndexes(rowIndex, colIdx);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex(row => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex(col => col.id === originCell.colId);

      absoluteLocation.rowIndex = rowIndex;
      absoluteLocation.colIndex = colIdx;

      return { ...store, focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex } };
    }
  }

  return store;
};

export const moveFocusDown = (store: ReactGridStore, currentFocus: FocusedCell) => {
  if (currentFocus.rowIndex === store.rows.length - 1) return store;

  const colIndex =
    "colSpan" in currentFocus && absoluteLocation.colIndex !== -1 ? absoluteLocation.colIndex : currentFocus.colIndex;

  // Look for the next focusable cell in the rows below the current focus
  for (let rowIdx = currentFocus.rowIndex + (currentFocus.rowSpan ?? 1); rowIdx < store.rows.length; rowIdx++) {
    const nextPossibleLocation = store.getCellByIndexes(rowIdx, colIndex);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex(row => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex(col => col.id === originCell.colId);

      absoluteLocation.rowIndex = rowIdx;
      absoluteLocation.colIndex = colIndex;

      return { ...store, focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex } };
    }
  }

  return store;
};

export const moveFocusLeft = (store: ReactGridStore, currentFocus: FocusedCell) => {
  if (currentFocus.colIndex === 0) return store;

  const rowIndex =
    "rowSpan" in currentFocus && absoluteLocation.rowIndex !== -1 ? absoluteLocation.rowIndex : currentFocus.rowIndex;

  // Look for the next focusable cell in the rows below the current focus
  for (let colIdx = currentFocus.colIndex - 1; colIdx >= 0; colIdx--) {
    const nextPossibleLocation = store.getCellByIndexes(rowIndex, colIdx);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex(row => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex(col => col.id === originCell.colId);

      absoluteLocation.rowIndex = rowIndex;
      if (originCell.colSpan ?? 1 > 1) absoluteLocation.colIndex = originColIndex;
      else absoluteLocation.colIndex = colIdx;

      return { ...store, focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex } };
    }
  }

  return store;
};

export const moveFocusPageUp = (store: ReactGridStore, currentFocus: FocusedCell) => {
  if (currentFocus.rowIndex === 0) return store;

  const colIndex =
    "colSpan" in currentFocus && absoluteLocation.colIndex !== -1 ? absoluteLocation.colIndex : currentFocus.colIndex;

    

  return store;
}