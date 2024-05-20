import { Behavior } from "../types/Behavior";
import { NO_CELL_LOCATION } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { findMinimalSelectedArea } from "../utils/findMinimalSelectedArea.ts";
import { getCellContainer } from "../utils/getCellContainer.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { getCellContainerLocation } from "../utils/getCellContainerLocation.ts";
import { getCellIndexesFromContainerElement } from "../utils/getCellIndexes";
import { getCellIndexesFromPointerLocation } from "../utils/getCellIndexesFromPointerLocation";
import { getNonStickyCellContainer } from "../utils/getNonStickyCellContainer";
import { isCellSticky } from "../utils/isCellSticky.ts";
import isDevEnvironment from "../utils/isDevEnvironment";
import { getScrollableParent } from "../utils/scrollHelpers";
import { scrollToElementEdge } from "../utils/scrollToElementEdge";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky";

const devEnvironment = isDevEnvironment();

/**
 * Tries to expand the selected area towards a target cell.
 *
 * @param store - The ReactGridStore instance.
 * @param cell - The target cell.
 * @param rowIndex - The row index of the target cell.
 * @param colIndex - The column index of the target cell.
 * @param isEntireColumnSelected - Whether the entire column is selected.
 * @returns The updated ReactGridStore instance.
 */
const tryExpandingTowardsCell = (
  store: ReactGridStore,
  cell: Cell,
  rowIndex: number,
  colIndex: number,
  isEntireColumnSelected: boolean = false
): ReactGridStore => {
  const selectedArea = structuredClone(store.selectedArea);
  const focusedLocation = structuredClone(store.focusedLocation);

  if (isEntireColumnSelected) {
    selectedArea.startRowIdx = 0;
    selectedArea.endRowIdx = store.rows.length;

    if (colIndex < store.absoluteFocusedLocation.colIndex) {
      // Moving to the left
      selectedArea.startColIdx = colIndex;
      selectedArea.endColIdx = store.absoluteFocusedLocation.colIndex + (cell?.colSpan || 1);
    } else {
      // Moving to the right
      selectedArea.startColIdx = store.absoluteFocusedLocation.colIndex;
      selectedArea.endColIdx = colIndex + (cell?.colSpan || 1);
    }
  } else {
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
  }

  const newSelectedArea = findMinimalSelectedArea(store, selectedArea);

  return {
    ...store,
    selectedArea: newSelectedArea,
  };
};

export const CellSelectionBehavior: Behavior = {
  id: "CellSelection",

  handlePointerMove(event, store) {
    devEnvironment && console.log("CSB/handlePointerMove");

    const { clientX, clientY } = event;
    const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(clientX, clientY);
    const cell = store.getCellByIndexes(rowIndex, colIndex);

    if (!cell) {
      return store;
    }

    const element = getCellContainerFromPoint(event.clientX, event.clientY);

    let newRowIndex = -1;

    if (element) {
      const { rowIndex } = getCellContainerLocation(element);
      newRowIndex = rowIndex;
    }

    const isEntireColumnSelected = newRowIndex === 0 && store.enableColumnSelection;

    return tryExpandingTowardsCell(store, cell, rowIndex, colIndex, isEntireColumnSelected);
  },

  handlePointerUp(event, store) {
    const DefaultBehavior = store.getBehavior("Default");

    store.onAreaSelected?.(store.selectedArea);

    return {
      ...store,
      currentBehavior: DefaultBehavior,
    };
  },

  handlePointerDownTouch(event, store) {
    devEnvironment && console.log("CSB/handlePointerDownTouch");

    const DefaultBehavior = store.getBehavior("Default");

    return {
      ...store,
      currentBehavior: DefaultBehavior,
    };
  },

  handlePointerUpTouch(event, store) {
    devEnvironment && console.log("CSB/handlePointerUpTouch");

    return store;
  },

  handlePointerEnter(event, store) {
    return store;
  },

  handlePointerHold: function (event, store) {
    devEnvironment && console.log("CSB/handlePointerHold");
    return store;
  },

  handlePointerHoldTouch: function (event, store) {
    devEnvironment && console.log("CSB/handlePointerHoldTouch");
    return store;
  },

  handlePointerMoveTouch(event, store) {
    devEnvironment && console.log("CSB/handlePointerMoveTouch");

    const { clientX, clientY } = event;

    const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(clientX, clientY);
    const cell = store.getCellByIndexes(rowIndex, colIndex);

    if (!cell) {
      return store;
    }

    const isStickyCell = isCellSticky(store, cell);
    const cellContainer = (
      isStickyCell ? getCellContainer(store, cell) : getNonStickyCellContainer(clientX, clientY)
    ) as HTMLElement | undefined;

    const element = getCellContainerFromPoint(event.clientX, event.clientY);

    let newRowIndex = -1;

    if (element) {
      const { rowIndex } = getCellContainerLocation(element);
      newRowIndex = rowIndex;
    }

    const isEntireColumnSelected = newRowIndex === 0 && store.enableColumnSelection;

    if (cellContainer) {
      const scrollableParent = getScrollableParent(cellContainer as HTMLElement, true);
      const scrollableParentIsNotAWindow =
        scrollableParent && "clientWidth" in scrollableParent && "clientHeight" in scrollableParent;

      scrollableParentIsNotAWindow ? scrollToElementEdge({ x: clientX, y: clientY }, scrollableParent) : () => {}; // TODO: scrollToWindowEdge({ x: clientX, y: clientY }); - function not implemented yet!
      // * scrollToWindowEdge - not possible to test in Ladle environment, due to clientX/Y acting like pageX/Y

      if (isStickyCell) {
        const nonStickyRowsAndColumns = getCellIndexesFromContainerElement(cellContainer);
        const { rowIndex, colIndex } = nonStickyRowsAndColumns || NO_CELL_LOCATION;
        scrollTowardsSticky(store, cell, { rowIndex, colIndex });

        return tryExpandingTowardsCell(store, cell, rowIndex, colIndex, isEntireColumnSelected);
      }
    }

    return tryExpandingTowardsCell(store, cell, rowIndex, colIndex, isEntireColumnSelected);
  },

  handlePointerEnterTouch(event, store) {
    return store;
  },
};
