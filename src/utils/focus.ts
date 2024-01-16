import { FocusedCell } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import {
  EMPTY_AREA,
  getCellContainer,
  getOriginCell,
  isCellInRange,
  isCellSpanned,
  isCellSticky,
  isSpanMember,
} from "./cellUtils";
import { getDistanceBetweenOffsets, getOffset } from "./getDistanceBetweenHTMLElements";
import { detectCollision, isCollision } from "./collisionUtils";
import { ReactGridStore } from "./reactGridStore";
import { scrollCellIntoView } from "./scrollCellIntoView";
import { getScrollOfScrollableElement, getScrollableParent } from "./scrollHelpers";
import { isInViewport } from "./isInViewport";

const absoluteLocation = {
  rowIndex: -1,
  colIndex: -1,
};

function getPaneBg() {
  const stickyCellPanes = [...document.getElementsByClassName("rgPane")].filter(
    (pane) => !pane.classList.contains("rgPane-Center")
  );

  const rgPaneBackgrounds = stickyCellPanes.map((pane) => {
    const rgPaneBg = [...pane.getElementsByClassName("rgPaneBackground")];
    if (rgPaneBg.length > 1) throw new Error("There should be only one rgPaneBackground for each CellPane!");
    return rgPaneBg[0];
  });

  return rgPaneBackgrounds;
}

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
      const originRowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex((col) => col.id === originCell.colId);

      if (originCell.rowSpan ?? 1 > 1) absoluteLocation.rowIndex = originRowIndex;
      else absoluteLocation.rowIndex = rowIdx;
      absoluteLocation.colIndex = colIndex;

      handleJumpScroll(store, currentFocus, originCell);

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

  const rowIndex =
    "rowSpan" in currentFocus && absoluteLocation.rowIndex !== -1 ? absoluteLocation.rowIndex : currentFocus.rowIndex;

  // Look for the next focusable cell to the right of the current focus
  for (let colIdx = currentFocus.colIndex + (currentFocus.colSpan ?? 1); colIdx < store.columns.length; colIdx++) {
    const nextPossibleLocation = store.getCellByIndexes(rowIndex, colIdx);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex((col) => col.id === originCell.colId);

      absoluteLocation.rowIndex = rowIndex;
      absoluteLocation.colIndex = colIdx;

      return {
        ...store,
        focusedLocation: { rowIndex: originRowIndex, colIndex: originColIndex },
        selectedArea: EMPTY_AREA,
      };
    }
  }

  return store;
};

function handleJumpScroll(store: ReactGridStore, previousCell: Cell, nextCell: Cell): void {
  const rgPaneBackgrounds = getPaneBg();
  // Want i want to achieve:
  // * If nextCell is not fully visible, scroll it into view (! not by using function with similar name!)
  // ! Do NOT scroll outer div's (don't use their scrollbars), use scrollableParent instead.
  // if (isCellSticky(store, previousCell)) {
  //   if (isCellSticky(store, nextCell)) {
  //     return;
  //   }
  // }

  if (!previousCell) return;
  const previousCellContainer = getCellContainer(store, previousCell) as HTMLElement;
  const nextCellContainer = getCellContainer(store, nextCell) as HTMLElement;
  if (!nextCellContainer) return;

  const scrollableParent = (getScrollableParent(nextCellContainer, true) as Element) ?? store.reactGridRef!;
  const scrollingDirection =
    store.rows.findIndex((row) => row.id === nextCell.rowId) >
    store.rows.findIndex((row) => row.id === previousCell.rowId)
      ? "Bottom"
      : "Top";
  const paneLocation = rgPaneBackgrounds.find((pane) => pane.className.includes(scrollingDirection)) as HTMLElement;

  const isNextCellFullyVisible =
    isInViewport(nextCellContainer, scrollableParent) && !isCollision(nextCellContainer, paneLocation);

  const isPreviousCellFullyVisible =
    isInViewport(previousCellContainer, scrollableParent) && !isCollision(previousCellContainer, paneLocation);

  const prevCellRect = previousCellContainer.getBoundingClientRect();
  const nextCellRect = nextCellContainer.getBoundingClientRect();

  console.log(isNextCellFullyVisible, paneLocation, detectCollision(nextCellContainer, paneLocation, true));

  let scrollValue: number;
  if (!isNextCellFullyVisible) {
    if (!isPreviousCellFullyVisible) {
      scrollValue = nextCellRect.top - prevCellRect.top + prevCellRect.height;
    } else {
      scrollValue = nextCellRect.top - prevCellRect.top;
    }

    scrollableParent.scrollBy({
      top: scrollValue,
    });
  }
}

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
      const originRowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex((col) => col.id === originCell.colId);

      absoluteLocation.rowIndex = rowIdx;
      absoluteLocation.colIndex = colIndex;

      handleJumpScroll(store, currentFocus, originCell);
      // if (originCellContainer && !isInViewport(originCellContainer as HTMLDivElement, store.reactGridRef!)) {
      //         //  Doesnt work...
      //   scrollCellIntoView(store, originCell)
      // }

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

  const rowIndex =
    "rowSpan" in currentFocus && absoluteLocation.rowIndex !== -1 ? absoluteLocation.rowIndex : currentFocus.rowIndex;

  // Look for the next focusable cell to the left of the current focus
  for (let colIdx = currentFocus.colIndex - 1; colIdx >= 0; colIdx--) {
    const nextPossibleLocation = store.getCellByIndexes(rowIndex, colIdx);

    // Check if the cell is focusable (by default it is)
    if (nextPossibleLocation && nextPossibleLocation?.isFocusable !== false) {
      const originCell = getOriginCell(store, nextPossibleLocation);
      const originRowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
      const originColIndex = store.columns.findIndex((col) => col.id === originCell.colId);

      absoluteLocation.rowIndex = rowIndex;
      if (originCell.colSpan ?? 1 > 1) absoluteLocation.colIndex = originColIndex;
      else absoluteLocation.colIndex = colIdx;

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

      return { ...store, focusedLocation: { rowIndex: rowIdx, colIndex: colIdx } };
    }
  }
};

export const moveFocusPageUp = (store: ReactGridStore, currentFocus: FocusedCell) => {
  if (currentFocus.rowIndex === 0) return store;

  const colIndex =
    "colSpan" in currentFocus && absoluteLocation.colIndex !== -1 ? absoluteLocation.colIndex : currentFocus.colIndex;

  return store;
};
