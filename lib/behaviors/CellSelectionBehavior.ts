import { Behavior } from "../types/Behavior.ts";
import { IndexedLocation, NO_CELL_LOCATION } from "../types/InternalModel.ts";
import { Cell } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { findMinimalSelectedArea } from "../utils/findMinimalSelectedArea.ts";
import { getCellContainer } from "../utils/getCellContainer.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { getCellContainerLocation } from "../utils/getCellContainerLocation.ts";
import { getCellIndexesFromContainerElement } from "../utils/getCellIndexes.ts";
import { getCellIndexesFromPointerLocation } from "../utils/getCellIndexesFromPointerLocation.ts";
import { getNonStickyCellContainer } from "../utils/getNonStickyCellContainer.ts";
import { isCellSticky } from "../utils/isCellSticky.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";
import { getScrollableParent } from "../utils/scrollHelpers.ts";
import { scrollToElementEdge } from "../utils/scrollToElementEdge.ts";

const devEnvironment = isDevEnvironment();

let startingCellPos: IndexedLocation | null = null;

/**
 * Tries to expand the selected area towards a target cell.
 *
 * @param store - The ReactGridStore instance.
 * @param cell - The target cell.
 * @param rowIndex - The row index of the target cell.
 * @param colIndex - The column index of the target cell.
 * @param shouldSelectEntireColumn - Whether the entire column should be selected or not
 * @returns The updated ReactGridStore instance.
 */
const tryExpandingTowardsCell = (
  store: ReactGridStore,
  cell: Cell,
  rowIndex: number,
  colIndex: number,
  shouldSelectEntireColumn: boolean = true,
  shouldEnableRowSelection: boolean = true
): ReactGridStore => {
  if (cell.isSelectable === false) {
    return store;
  }

  const selectedArea = structuredClone(store.selectedArea);
  const focusedLocation = structuredClone(store.focusedLocation);

  if (shouldSelectEntireColumn) {
    selectedArea.startRowIdx = 0;
    selectedArea.endRowIdx = store.rows.length;

    if (colIndex < store.absoluteFocusedLocation.colIndex) {
      // Moving to the left
      selectedArea.startColIdx = colIndex;
      selectedArea.endColIdx = store.absoluteFocusedLocation.colIndex + 1;
    } else {
      // Moving to the right
      selectedArea.startColIdx = store.absoluteFocusedLocation.colIndex;
      selectedArea.endColIdx = colIndex + (cell?.colSpan || 1);
    }
  } else if (shouldEnableRowSelection) {
    selectedArea.startColIdx = 0;
    selectedArea.endColIdx = store.columns.length;

    if (rowIndex < store.absoluteFocusedLocation.rowIndex) {
      // Moving up
      selectedArea.startRowIdx = rowIndex;
      selectedArea.endRowIdx = store.absoluteFocusedLocation.rowIndex + 1;
    } else {
      // Moving down
      selectedArea.startRowIdx = store.absoluteFocusedLocation.rowIndex;
      selectedArea.endRowIdx = rowIndex + (cell?.rowSpan || 1);
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

    if (element) {
      const { rowIndex, colIndex } = getCellContainerLocation(element);
      if (!startingCellPos) startingCellPos = { rowIndex, colIndex };
    }

    const shouldSelectEntireColumn = startingCellPos?.rowIndex === 0 && store.enableColumnSelectionOnFirstRow;
    const shouldEnableRowSelection = startingCellPos?.colIndex === 0 && store.enableRowSelectionOnFirstColumn;

    return tryExpandingTowardsCell(store, cell, rowIndex, colIndex, shouldSelectEntireColumn, shouldEnableRowSelection);
  },

  handlePointerUp(event, store) {
    devEnvironment && console.log("CSB/handlePointerUp");

    startingCellPos = null;

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

    startingCellPos = null;

    const DefaultBehavior = store.getBehavior("Default");

    return {
      ...store,
      currentBehavior: DefaultBehavior,
    };
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

    if (element) {
      const { rowIndex, colIndex } = getCellContainerLocation(element);
      if (!startingCellPos) startingCellPos = { rowIndex, colIndex };
    }

    const shouldSelectEntireColumn = startingCellPos?.rowIndex === 0 && store.enableColumnSelectionOnFirstRow;
    const shouldEnableRowSelection = startingCellPos?.colIndex === 0 && store.enableRowSelectionOnFirstColumn;

    console.log({ shouldEnableRowSelection, shouldSelectEntireColumn });

    if (cellContainer) {
      const scrollableParent = getScrollableParent(cellContainer as HTMLElement, true);
      const scrollableParentIsNotAWindow =
        scrollableParent && "clientWidth" in scrollableParent && "clientHeight" in scrollableParent;

      scrollableParentIsNotAWindow ? scrollToElementEdge({ x: clientX, y: clientY }, scrollableParent) : () => {};
      // TODO: scrollToWindowEdge({ x: clientX, y: clientY }); - function not implemented yet!
      // * scrollToWindowEdge - not possible to test in Ladle environment, due to clientX/Y acting like pageX/Y

      if (isStickyCell) {
        const nonStickyRowsAndColumns = getCellIndexesFromContainerElement(cellContainer);
        const { rowIndex, colIndex } = nonStickyRowsAndColumns || NO_CELL_LOCATION;

        return tryExpandingTowardsCell(
          store,
          cell,
          rowIndex,
          colIndex,
          shouldSelectEntireColumn,
          shouldEnableRowSelection
        );
      }
    }

    return tryExpandingTowardsCell(store, cell, rowIndex, colIndex, shouldSelectEntireColumn, shouldEnableRowSelection);
  },

  handlePointerEnterTouch(event, store) {
    return store;
  },
};
