import { Behavior, BehaviorConstructor } from "../types/Behavior";
import { Cell } from "../types/PublicModel";
import { findMinimalSelectedArea, isCellInRange, isCellSticky } from "../utils/cellUtils";
import { getCellFromPointer } from "../utils/getCellFromPointer";
import { ReactGridStore } from "../utils/reactGridStore";
import { getScrollOfScrollableElement, getScrollableParent, getSizeOfScrollableElement } from "../utils/scrollHelpers";
import { getRowAndColumns } from "../utils/getRowAndColumns";
import { getNonStickyCell } from "../utils/getNonStickyCell";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky";

// const tryExpandingTowardsPointer = (store: ReactGridStore, x: number, y: number) => {
//   if (!store.reactGridRef) return store;

//   const selectedArea = store.selectedArea;
//   // const focusIndicatorEl = document.getElementsByClassName("rgFocusIndicator")[0] as HTMLElement;
//   const selectionIndicatorEl = document.getElementsByClassName("rgSelectionIndicator")[0] as HTMLElement;

//   if (!selectionIndicatorEl) return store;

//   const { top, right, bottom, left } = selectionIndicatorEl.getBoundingClientRect();

//   let colIndex = -1;
//   let rowIndex = -1;

//   const getXWithinSelection = (x: number) => {
//     if (x < left) return left + 1;
//     if (x > right) return right - 1;
//     return right - left;
//   };

//   if (y < top) rowIndex = selectedArea.startRowIdx - 1;
//   else if (y > bottom) rowIndex = selectedArea.endRowIdx + 1;
//   else rowIndex = getLocationFromClient(store, getXWithinSelection(x), y).rowIndex;

//   const getYWithinSelection = (y: number) => {
//     if (y < top) return top + 1;
//     if (y > bottom) return bottom - 1;
//     return y;
//   };

//   if (x < left) colIndex = selectedArea.startColIdx - 1;
//   else if (x > right) colIndex = selectedArea.endColIdx + 1;
//   else colIndex = getLocationFromClient(store, x, getYWithinSelection(y)).colIndex;

//   const cell = store.getCellByIndexes(rowIndex, colIndex);
//   if (!cell) return store;

//   return tryExpandingTowardsCell(store, cell, rowIndex, colIndex);

//   // if (y < top) {
//   //   // Pointer is above the selection indicator on the row axis
//   //   // colIndex = getLocationFromClient(store, x, top + 1).colIndex;
//   //   const { colIndex } = getLocationFromClient(store, x, top + 1);
//   //   const cell = store.getCellByIndexes(selectedArea.startRowIdx - 1, colIndex);

//   //   if (!cell) return store;

//   //   return tryExpandingTowardsCell(store, cell, selectedArea.startRowIdx - 1, colIndex);
//   // } else if (y > bottom) {
//   //   // Pointer is below the selection indicator on the row axis
//   //   // colIndex = getLocationFromClient(store, x, bottom - 1).colIndex;
//   //   const { colIndex } = getLocationFromClient(store, x, bottom - 1);
//   //   const cell = store.getCellByIndexes(selectedArea.endRowIdx - 1, colIndex);

//   //   if (!cell) return store;

//   //   return tryExpandingTowardsCell(store, cell, selectedArea.endRowIdx, colIndex);
//   // }

//   // if (x < left) {
//   //   // Pointer is before the selection indicator on the column axis
//   //   // rowIndex = getLocationFromClient(store, left + 1, y).rowIndex;
//   //   const { rowIndex } = getLocationFromClient(store, left + 1, y);
//   //   const cell = store.getCellByIndexes(rowIndex, selectedArea.startColIdx - 1);

//   //   if (!cell) return store;

//   //   return tryExpandingTowardsCell(store, cell, rowIndex, selectedArea.startColIdx - 1);
//   // } else if (x > right) {
//   //   // Pointer is after the selection indicator on the column axis
//   //   // rowIndex = getLocationFromClient(store, right - 1, y).rowIndex;
//   //   const { rowIndex } = getLocationFromClient(store, right - 1, y);
//   //   const cell = store.getCellByIndexes(rowIndex, selectedArea.endColIdx - 1);

//   //   if (!cell) return store;

//   //   return tryExpandingTowardsCell(store, cell, rowIndex, selectedArea.endColIdx - 1);
//   // }

//   // return store;

//   // const cell = store.getCellByIndexes(rowIndex, colIndex);
//   // if (!cell) return store;

//   // return tryExpandingTowardsCell(store, cell, rowIndex, colIndex);
// };

const tryExpandingTowardsCell = (
  store: ReactGridStore,
  cell: Cell,
  rowIndex: number,
  colIndex: number
): ReactGridStore => {
  const selectedArea = store.selectedArea;
  const focusedLocation = store.focusedLocation;

  if (rowIndex < focusedLocation.rowIndex) {
    // Targeted cell start's at the row before the focused cell
    selectedArea.endRowIdx = focusedLocation.rowIndex + 1;
    selectedArea.startRowIdx = rowIndex;
  } else {
    // Targeted cell start's at the row after the focused cell
    selectedArea.endRowIdx = rowIndex + (cell?.rowSpan || 1);
    selectedArea.startRowIdx = focusedLocation.rowIndex;
  }

  if (colIndex < focusedLocation.colIndex) {
    // Targeted cell start's at the column before the focused cell
    selectedArea.endColIdx = focusedLocation.colIndex + 1;
    selectedArea.startColIdx = colIndex;
  } else {
    // Targeted cell start's at the column after the focused cell
    selectedArea.endColIdx = colIndex + (cell?.colSpan || 1);
    selectedArea.startColIdx = focusedLocation.colIndex;
  }

  const newSelectedArea = findMinimalSelectedArea(store, selectedArea);

  // if (areAreasEqual(getCellArea(store, cell), newSelectedArea)) {
  //   return {
  //     ...store,
  //     selectedArea: {
  //       startRowIdx: -1,
  //       endRowIdx: -1,
  //       startColIdx: -1,
  //       endColIdx: -1,
  //     },
  //   };
  // }

  return {
    ...store,
    selectedArea: {
      ...newSelectedArea,
    },
  };
};

const handleSelectionOnStickyPane = (
  store: ReactGridStore,
  cell: Cell,
  rowIndex: number,
  colIndex: number,
  x: number,
  y: number
): ReactGridStore => {
  if (!store.reactGridRef) throw new Error("ReactGridRef is not assigned!");

  const selectedArea = store.selectedArea;
  const scrollableElement = getScrollableParent(store.reactGridRef, false);
  const { scrollTop, scrollHeight, scrollLeft, scrollWidth } = getScrollOfScrollableElement(scrollableElement);
  const { width, height } = getSizeOfScrollableElement(scrollableElement);

  if (isCellInRange(store, cell, store.paneRanges.TopCenter)) {
    scrollableElement?.scrollBy({ top: -10 });
    if (scrollTop !== 0) {
      // The grid is not scrolled to the top, but the pointer is on the top pane
      // so we need to find the indexes of the cell above the selection in the column targeted by the pointer
      const cell = store.getCellByIndexes(selectedArea.startRowIdx - 1, colIndex);
      if (!cell) return store;

      return tryExpandingTowardsCell(store, cell, selectedArea.startRowIdx - 1, colIndex);
    }
  } else if (isCellInRange(store, cell, store.paneRanges.Right)) {
    scrollableElement?.scrollBy({ left: 10 });
    if (Math.abs(scrollLeft + width - scrollWidth) > 5) {
      // The grid is not scrolled to the right, but the pointer is on the right pane
      // so we need to find the indexes of the cell on the right of the selection in the row targeted by the pointer
      const cell = store.getCellByIndexes(rowIndex, selectedArea.endColIdx + 1);
      if (!cell) return store;

      return tryExpandingTowardsCell(store, cell, rowIndex, selectedArea.endColIdx + 1);
    }
  } else if (isCellInRange(store, cell, store.paneRanges.BottomCenter)) {
    scrollableElement?.scrollBy({ top: 10 });
    if (Math.abs(scrollTop + height - scrollHeight) > 5) {
      // The grid is not scrolled to the bottom, but the pointer is on the bottom pane
      // so we need to find the indexes of the cell below the selection in the column targeted by the pointer
      const cell = store.getCellByIndexes(selectedArea.endRowIdx + 1, colIndex);
      if (!cell) return store;

      return tryExpandingTowardsCell(store, cell, selectedArea.endRowIdx + 1, colIndex);
    }
  } else if (isCellInRange(store, cell, store.paneRanges.Left)) {
    scrollableElement?.scrollBy({ left: -10 });
    if (scrollLeft !== 0) {
      // The grid is not scrolled to the left, but the pointer is on the left pane
      // so we need to find the indexes of the cell on the left of the selection in the row targeted by the pointer
      const cell = store.getCellByIndexes(rowIndex, selectedArea.startColIdx - 1);
      if (!cell) return store;

      return tryExpandingTowardsCell(store, cell, rowIndex, selectedArea.startColIdx - 1);
    }
  }

  // return tryExpandingTowardsCell(store, cell, rowIndex, colIndex);
  return store;
};

let interval: ReturnType<typeof setInterval> | null = null;
export const CellSelectionBehavior: BehaviorConstructor = (setCurrentBehavior) => {
  const behavior: Behavior = {
    id: "CellSelection",

    handlePointerMove(event, store) {
      console.log("CSB/handlePointerMove");

      const { clientX, clientY } = event;
      const { rowIndex, colIndex } = getCellFromPointer(clientX, clientY);
      const cell = store.getCellByIndexes(rowIndex, colIndex);

      if (!cell) return store;

      if (isCellSticky(store, cell)) {
        const cellUnderTheSticky = getNonStickyCell(store, clientX, clientY);

        if (!interval) {
          interval = setInterval(() => {
            console.log('interval')
            scrollTowardsSticky(store, cell, { rowIndex, colIndex });
          }, 300);
        }

        if (cellUnderTheSticky) {
          const nonStickyRowsAndColumns = getRowAndColumns(cellUnderTheSticky);
          const { rowIndex: secondCellRowIndex, colIndex: secondCellColIndex } = nonStickyRowsAndColumns || {
            rowIndex: -1,
            colIndex: -1,
          };

          return tryExpandingTowardsCell(store, cell, secondCellRowIndex, secondCellColIndex);
        }
      }

      return tryExpandingTowardsCell(store, cell, rowIndex, colIndex);
    },

    handlePointerUp(event, store) {
      // window.removeEventListener("pointermove", (e) => behavior.handlePointerMove(e, store));
      // window.removeEventListener("pointerup", (e) => behavior.handlePointerUp(e, store));
      const DefaultBehavior = store.getBehavior("Default");
      console.log('up', interval)
      if (interval) {

        clearInterval(interval);
        interval = null;
      }
      setCurrentBehavior(DefaultBehavior(setCurrentBehavior));

      return store;
    },
  };

  return behavior;
};
