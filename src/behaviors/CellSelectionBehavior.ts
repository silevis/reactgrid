import { Behavior } from "../types/Behavior";
import { Cell } from "../types/PublicModel";
import { findMinimalSelectedArea, getCellContainer, isCellSticky } from "../utils/cellUtils";
import { getCellIndexesFromPointerLocation } from "../utils/getCellIndexesFromPointerLocation";
import { ReactGridStore } from "../utils/reactGridStore";
import { getCellIndexesFromContainerElement } from "../utils/getCellIndexes";
import { getNonStickyCellContainer } from "../utils/getNonStickyCellContainer";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky";
import { isMobile } from "../utils/isMobile";
import { getScrollableParent } from "../utils/scrollHelpers";
import { scrollToElementEdge } from "../utils/scrollToElementEdge";

/**
 * Tries to expand the selected area towards a target cell.
 *
 * @param store - The ReactGridStore instance.
 * @param cell - The target cell.
 * @param rowIndex - The row index of the target cell.
 * @param colIndex - The column index of the target cell.
 * @returns The updated ReactGridStore instance.
 */
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

  return {
    ...store,
    selectedArea: {
      ...newSelectedArea,
    },
  };
};

const blankIndexes = {
  rowIndex: -1,
  colIndex: -1,
};

export const CellSelectionBehavior: Behavior = {
  handlePointerMove(event, store) {
    if (isMobile()) {
      return store;
    }
    console.log("CSB/handlePointerMove");

    const { clientX, clientY } = event;
    const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(clientX, clientY);
    const cell = store.getCellByIndexes(rowIndex, colIndex);

    if (!cell) {
      return store;
    }

    if (isCellSticky(store, cell)) {
      const cellUnderTheSticky = getNonStickyCellContainer(clientX, clientY);

      scrollTowardsSticky(store, cell, { rowIndex, colIndex });

      if (cellUnderTheSticky) {
        const nonStickyRowsAndColumns = getCellIndexesFromContainerElement(cellUnderTheSticky);
        const { rowIndex: secondCellRowIndex, colIndex: secondCellColIndex } = nonStickyRowsAndColumns || {
          rowIndex: -1,
          colIndex: -1,
        };

        return tryExpandingTowardsCell(store, cell, secondCellRowIndex, secondCellColIndex);
      }
    }

    return tryExpandingTowardsCell(store, cell, rowIndex, colIndex);
  },

  handlePointerUp(_event, store) {
    if (isMobile()) {
      return store;
    }
    const DefaultBehavior = store.getBehavior("Default");

    return {
      ...store,
      currentBehavior: DefaultBehavior,
    };
  },

  handleTouchStart(_event, store) {
    console.log("CSB/handleTouchStart");

    const DefaultBehavior = store.getBehavior("Default");

    return {
      ...store,
      currentBehavior: DefaultBehavior,
    };
  },

  handleTouchEnd(event, store) {
    console.log("CSB/handleTouchEnd");

    return store;
  },

  handleTouchMove(event, store) {
    console.log("CSB/handleTouchMove");
    event.preventDefault(); // disable move/scroll move

    const touchedElement = event.touches[0]; //  * This might be not a good idea to do it that way...
    const { clientX, clientY } = touchedElement;
    const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(clientX, clientY);
    const cell = store.getCellByIndexes(rowIndex, colIndex);

    if (!cell) {
      return store;
    }

    const isStickyCell = isCellSticky(store, cell);
    const cellContainer = isStickyCell ? getCellContainer(store, cell) : getNonStickyCellContainer(clientX, clientY);

    if (cellContainer) {
      const scrollableParent = getScrollableParent(cellContainer as HTMLElement, true);
      const scrollableParentIsNotAWindow =
        scrollableParent && "clientWidth" in scrollableParent && "clientHeight" in scrollableParent;

      scrollableParentIsNotAWindow ? scrollToElementEdge({ x: clientX, y: clientY }, scrollableParent) : () => {}; // TODO: scrollToWindowEdge({ x: clientX, y: clientY }); - function not implemented yet!

      if (isStickyCell) {
        const nonStickyRowsAndColumns = getCellIndexesFromContainerElement(cellContainer);
        const { rowIndex, colIndex } = nonStickyRowsAndColumns || blankIndexes;
        scrollTowardsSticky(store, cell, {rowIndex, colIndex });

        return tryExpandingTowardsCell(store, cell, rowIndex, colIndex);
      }
    }

    return tryExpandingTowardsCell(store, cell, rowIndex, colIndex);
  },
};
