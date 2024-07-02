import { FocusedCell } from "../types/InternalModel.ts";
import { isSpanMember } from "./isSpanMember.ts";
import { getOriginCell } from "./getOriginCell.ts";
import { EMPTY_AREA } from "../types/InternalModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { emitEvent } from "./emitEvent.ts";
import { getScrollableParent } from "./scrollHelpers.ts";
import { getCellContainer } from "./getCellContainer.ts";
import { handlePaneOverlap } from "./handlePaneOverlap.ts";

export const moveFocusUp = (store: ReactGridStore, currentFocus: FocusedCell): ReactGridStore => {
  if (currentFocus.rowIndex === 0) return store;

  const cellContainer = getCellContainer(store, currentFocus) as HTMLElement;

  const scrollableParent = (getScrollableParent(cellContainer, true) as Element) ?? store.reactGridRef!;

  const colIndex =
    "colSpan" in currentFocus && store.absoluteFocusedLocation.colIndex !== -1
      ? store.absoluteFocusedLocation.colIndex
      : currentFocus.colIndex;

  // Look for the next focusable cell in the rows above the current focus
  for (let rowIndex = currentFocus.rowIndex - 1; rowIndex >= 0; rowIndex--) {
    const nextPossibleLocation = store.getCellByIndexes(rowIndex, colIndex);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex((col) => col.id === originCell.colId);

      if (originCell.rowSpan ?? 1 > 1) store.absoluteFocusedLocation.rowIndex = originRowIndex;
      else store.absoluteFocusedLocation.rowIndex = rowIndex;
      store.absoluteFocusedLocation.colIndex = colIndex;

      emitEvent("focuschange", { currentFocus });

      handlePaneOverlap(store, rowIndex, colIndex, scrollableParent);

      return {
        ...store,
        focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex },
        selectedArea: EMPTY_AREA,
      };
    }
  }

  return store;
};

export const moveFocusRight = (store: ReactGridStore, currentFocus: FocusedCell): ReactGridStore => {
  if (currentFocus.colIndex === store.columns.length - 1) return store;

  const cellContainer = getCellContainer(store, currentFocus) as HTMLElement;

  const scrollableParent = (getScrollableParent(cellContainer, true) as Element) ?? store.reactGridRef!;

  const rowIndex =
    "rowSpan" in currentFocus && store.absoluteFocusedLocation.rowIndex !== -1
      ? store.absoluteFocusedLocation.rowIndex
      : currentFocus.rowIndex;

  // Look for the next focusable cell to the right of the current focus
  for (
    let colIndex = currentFocus.colIndex + (currentFocus.colSpan ?? 1);
    colIndex < store.columns.length;
    colIndex++
  ) {
    const nextPossibleLocation = store.getCellByIndexes(rowIndex, colIndex);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex((col) => col.id === originCell.colId);

      store.absoluteFocusedLocation.rowIndex = rowIndex;
      store.absoluteFocusedLocation.colIndex = colIndex;

      emitEvent("focuschange", { currentFocus });

      handlePaneOverlap(store, rowIndex, colIndex, scrollableParent);

      return {
        ...store,
        focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex },
        selectedArea: EMPTY_AREA,
      };
    }
  }

  return store;
};

export const moveFocusDown = (store: ReactGridStore, currentFocus: FocusedCell) => {
  if (currentFocus.rowIndex === store.rows.length - 1) return store;

  const cellContainer = getCellContainer(store, currentFocus) as HTMLElement;

  const scrollableParent = (getScrollableParent(cellContainer, true) as Element) ?? store.reactGridRef!;

  const colIndex =
    "colSpan" in currentFocus && store.absoluteFocusedLocation.colIndex !== -1
      ? store.absoluteFocusedLocation.colIndex
      : currentFocus.colIndex;

  // Look for the next focusable cell in the rows below the current focus
  for (let rowIndex = currentFocus.rowIndex + (currentFocus.rowSpan ?? 1); rowIndex < store.rows.length; rowIndex++) {
    const nextPossibleLocation = store.getCellByIndexes(rowIndex, colIndex);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex((col) => col.id === originCell.colId);

      store.absoluteFocusedLocation.rowIndex = rowIndex;
      store.absoluteFocusedLocation.colIndex = colIndex;

      emitEvent("focuschange", { currentFocus });

      handlePaneOverlap(store, rowIndex, colIndex, scrollableParent);

      return {
        ...store,
        focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex },
        selectedArea: EMPTY_AREA,
      };
    }
  }

  return store;
};

export const moveFocusLeft = (store: ReactGridStore, currentFocus: FocusedCell) => {
  if (currentFocus.colIndex === 0) return store;

  const cellContainer = getCellContainer(store, currentFocus) as HTMLElement;

  const scrollableParent = (getScrollableParent(cellContainer, true) as Element) ?? store.reactGridRef!;

  const rowIndex =
    "rowSpan" in currentFocus && store.absoluteFocusedLocation.rowIndex !== -1
      ? store.absoluteFocusedLocation.rowIndex
      : currentFocus.rowIndex;

  // Look for the next focusable cell to the left of the current focus
  for (let colIndex = currentFocus.colIndex - 1; colIndex >= 0; colIndex--) {
    const nextPossibleLocation = store.getCellByIndexes(rowIndex, colIndex);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex((col) => col.id === originCell.colId);

      store.absoluteFocusedLocation.rowIndex = rowIndex;
      if (originCell.colSpan ?? 1 > 1) store.absoluteFocusedLocation.colIndex = originColIndex;
      else store.absoluteFocusedLocation.colIndex = colIndex;

      emitEvent("focuschange", { currentFocus });

      handlePaneOverlap(store, rowIndex, colIndex, scrollableParent);

      return {
        ...store,
        focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex },
        selectedArea: EMPTY_AREA,
      };
    }
  }

  return store;
};

export const moveFocusInsideSelectedRange = (
  store: ReactGridStore,
  currentFocus: FocusedCell,
  direction: "up" | "right" | "down" | "left"
) => {
  switch (direction) {
    case "right": {
      // Finding the next focusable cell - going from left to right starting at the currently focused position - that is inside the selected area, is focusable and optionally is spanned, but skipping every span member until the next valid cell is found.
      let colIdx = currentFocus.colIndex;
      let rowIdx = currentFocus.rowIndex;
      let nextPossibleLocation = store.getCellOrSpanMemberByIndexes(rowIdx, colIdx);

      do {
        colIdx++;

        // If we reached the end of the row, go to the next row
        if (colIdx === store.selectedArea.endColIdx) {
          colIdx = store.selectedArea.startColIdx;
          rowIdx++;

          // If we reached the end of the selected area, go to the first cell in the selected area
          if (rowIdx === store.selectedArea.endRowIdx) {
            rowIdx = store.selectedArea.startRowIdx;
          }
        }

        nextPossibleLocation = store.getCellOrSpanMemberByIndexes(rowIdx, colIdx);
      } while (
        !nextPossibleLocation ||
        isSpanMember(nextPossibleLocation) ||
        nextPossibleLocation?.isFocusable === false
      );

      return { ...store, focusedLocation: { rowIndex: rowIdx, colIndex: colIdx } };
    }

    case "left": {
      // Finding the next focusable cell - going from right to left starting at the currently focused position - that is inside the selected area, is focusable and optionally is spanned, but skipping every span member until the next valid cell is found.
      let colIdx = currentFocus.colIndex;
      let rowIdx = currentFocus.rowIndex;
      let nextPossibleLocation = store.getCellOrSpanMemberByIndexes(rowIdx, colIdx);

      do {
        colIdx--;

        // If we reached the start of the row, go to the previous row
        if (colIdx === store.selectedArea.startColIdx - 1) {
          colIdx = store.selectedArea.endColIdx - 1;
          rowIdx--;

          // If we reached the start of the selected area, go to the last cell in the selected area
          if (rowIdx === store.selectedArea.startRowIdx - 1) {
            rowIdx = store.selectedArea.endRowIdx - 1;
          }
        }

        nextPossibleLocation = store.getCellOrSpanMemberByIndexes(rowIdx, colIdx);
      } while (
        !nextPossibleLocation ||
        isSpanMember(nextPossibleLocation) ||
        nextPossibleLocation?.isFocusable === false
      );

      return { ...store, focusedLocation: { rowIndex: rowIdx, colIndex: colIdx } };
    }

    case "down": {
      // Finding the next focusable cell - going from top to bottom starting at the currently focused position - that is inside the selected area, is focusable and optionally is spanned, but skipping every span member until the next valid cell is found.
      let colIdx = currentFocus.colIndex;
      let rowIdx = currentFocus.rowIndex;
      let nextPossibleLocation = store.getCellOrSpanMemberByIndexes(rowIdx, colIdx);

      do {
        rowIdx++;

        // If we reached the end of the column, go to the next column
        if (rowIdx === store.selectedArea.endRowIdx) {
          rowIdx = store.selectedArea.startRowIdx;
          colIdx++;

          // If we reached the end of the selected area, go to the first cell in the selected area
          if (colIdx === store.selectedArea.endColIdx) {
            colIdx = store.selectedArea.startColIdx;
          }
        }

        nextPossibleLocation = store.getCellOrSpanMemberByIndexes(rowIdx, colIdx);
      } while (
        !nextPossibleLocation ||
        isSpanMember(nextPossibleLocation) ||
        nextPossibleLocation?.isFocusable === false
      );

      return { ...store, focusedLocation: { rowIndex: rowIdx, colIndex: colIdx } };
    }

    case "up": {
      // Finding the next focusable cell - going from bottom to top starting at the currently focused position - that is inside the selected area, is focusable and optionally is spanned, but skipping every span member until the next valid cell is found.
      let colIdx = currentFocus.colIndex;
      let rowIdx = currentFocus.rowIndex;
      let nextPossibleLocation = store.getCellOrSpanMemberByIndexes(rowIdx, colIdx);

      do {
        rowIdx--;

        // If we reached the start of the column, go to the previous column
        if (rowIdx === store.selectedArea.startRowIdx - 1) {
          rowIdx = store.selectedArea.endRowIdx - 1;
          colIdx--;

          // If we reached the start of the selected area, go to the last cell in the selected area
          if (colIdx === store.selectedArea.startColIdx - 1) {
            colIdx = store.selectedArea.endColIdx - 1;
          }
        }

        nextPossibleLocation = store.getCellOrSpanMemberByIndexes(rowIdx, colIdx);
      } while (
        !nextPossibleLocation ||
        isSpanMember(nextPossibleLocation) ||
        nextPossibleLocation?.isFocusable === false
      );

      emitEvent("focuschange", { currentFocus });

      return { ...store, focusedLocation: { rowIndex: rowIdx, colIndex: colIdx } };
    }
  }
};

// TODO: Implement this. The Row/Col Measurements might be helpful here.
export const moveFocusPageUp = (store: ReactGridStore, currentFocus: FocusedCell) => {
  if (currentFocus.rowIndex === 0) return store;

  return store;
};
