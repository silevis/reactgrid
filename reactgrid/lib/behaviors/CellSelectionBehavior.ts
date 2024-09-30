import isEqual from "lodash.isequal";
import { Behavior } from "../types/Behavior.ts";
import { EMPTY_AREA, IndexedLocation, NO_CELL_LOCATION } from "../types/InternalModel.ts";
import { Cell } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { findMinimalSelectedArea } from "../utils/findMinimalSelectedArea.ts";
import { getCellContainer } from "../utils/getCellContainer.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { getCellIndexesFromContainerElement } from "../utils/getCellIndexes.ts";
import { getCellIndexesFromPointerLocation } from "../utils/getCellIndexesFromPointerLocation.ts";
import { getNonStickyCellContainer } from "../utils/getNonStickyCellContainer.ts";
import { getPaneNameByCell } from "../utils/getPaneNameByCell.ts";
import { isCellSticky } from "../utils/isCellSticky.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";
import { getScrollableParent } from "../utils/scrollHelpers.ts";
import { scrollToElementEdge } from "../utils/scrollToElementEdge.ts";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky.ts";
import { isSpanMember } from "../utils/isSpanMember.ts";

const devEnvironment = isDevEnvironment();

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
  {
    currentDragOverCell,
    startingPointerIdx,
    currentPointerIdx,
    shouldSelectEntireColumn = true,
    shouldEnableRowSelection = true,
  }: {
    currentDragOverCell: Cell;
    startingPointerIdx: IndexedLocation;
    currentPointerIdx: IndexedLocation;
    shouldSelectEntireColumn: boolean;
    shouldEnableRowSelection: boolean;
  }
): ReactGridStore => {
  if (currentDragOverCell.isSelectable === false) {
    return store;
  }

  const selectedArea = structuredClone(store.selectedArea);
  const focusedLocation = structuredClone(store.focusedLocation);

  if (shouldSelectEntireColumn) {
    selectedArea.startRowIdx = 0;
    selectedArea.endRowIdx = store.rows.length;

    if (currentPointerIdx.colIndex < startingPointerIdx.colIndex) {
      // Moving to the left
      selectedArea.startColIdx = currentPointerIdx.colIndex;
      selectedArea.endColIdx = startingPointerIdx.colIndex + 1;
    } else {
      // Moving to the right
      selectedArea.startColIdx = startingPointerIdx.colIndex;
      selectedArea.endColIdx = currentPointerIdx.colIndex + (currentDragOverCell?.colSpan || 1);
    }

    // Check if the first row cell is selectable and focusable
    for (let colIdx = selectedArea.startColIdx; colIdx < selectedArea.endColIdx; colIdx++) {
      const firstCell = store.cells.get(`0 ${colIdx}`);

      if (!firstCell) return store;

      if (isSpanMember(firstCell)) {
        const originCell = store.getCellByIndexes(firstCell.originRowIndex, firstCell.originColIndex);
        if (originCell && (originCell.isSelectable === false || originCell.isFocusable === false)) {
          return store;
        }
      } else {
        if (firstCell.isSelectable === false || firstCell.isFocusable === false) {
          return store; // Do not select this column
        }
      }
    }
  } else if (shouldEnableRowSelection) {
    selectedArea.startColIdx = 0;
    selectedArea.endColIdx = store.columns.length;

    if (currentPointerIdx.rowIndex < startingPointerIdx.rowIndex) {
      // Moving up
      selectedArea.startRowIdx = currentPointerIdx.rowIndex;
      selectedArea.endRowIdx = startingPointerIdx.rowIndex + 1;
    } else {
      // Moving down
      selectedArea.startRowIdx = startingPointerIdx.rowIndex;
      selectedArea.endRowIdx = currentPointerIdx.rowIndex + (currentDragOverCell?.rowSpan || 1);
    }

    // Check if the first column cell is selectable and focusable
    for (let rowIdx = selectedArea.startRowIdx; rowIdx < selectedArea.endRowIdx; rowIdx++) {
      const firstCell = store.cells.get(`${rowIdx} 0`);

      if (!firstCell) return store;

      if (isSpanMember(firstCell)) {
        const originCell = store.getCellByIndexes(firstCell.originRowIndex, firstCell.originColIndex);
        if (originCell && (originCell.isSelectable === false || originCell.isFocusable === false)) {
          return store;
        }
      } else {
        if (firstCell.isSelectable === false || firstCell.isFocusable === false) {
          return store; // Do not select this row
        }
      }
    }
  } else {
    if (currentPointerIdx.rowIndex < focusedLocation.rowIndex) {
      // Targeted cell start's at the row before the focused cell
      selectedArea.endRowIdx = focusedLocation.rowIndex + 1;
      selectedArea.startRowIdx = currentPointerIdx.rowIndex;
    } else {
      // Targeted cell start's at the row after the focused cell
      selectedArea.endRowIdx = currentPointerIdx.rowIndex + (currentDragOverCell?.rowSpan || 1);
      selectedArea.startRowIdx = focusedLocation.rowIndex;
    }

    if (currentPointerIdx.colIndex < focusedLocation.colIndex) {
      // Targeted cell start's at the column before the focused cell
      selectedArea.endColIdx = focusedLocation.colIndex + 1;
      selectedArea.startColIdx = currentPointerIdx.colIndex;
    } else {
      // Targeted cell start's at the column after the focused cell
      selectedArea.endColIdx = currentPointerIdx.colIndex + (currentDragOverCell?.colSpan || 1);
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
    const currentPointerIdx = getCellIndexesFromPointerLocation(clientX, clientY);
    const currentDragOverCell = store.getCellByIndexes(currentPointerIdx.rowIndex, currentPointerIdx.colIndex);

    let PreviousPane;

    if (!isEqual(store.selectedArea, EMPTY_AREA)) {
      // Get the previous pane based on the last cell of the selected area (where the fill handle button is located)
      PreviousPane = getPaneNameByCell(
        store,
        store.getCellByIndexes(store.pointerStartIdx.rowIndex, store.pointerStartIdx.colIndex)
      );
    } else {
      // Get the previous pane based on the focused cell
      PreviousPane = getPaneNameByCell(store, store.getFocusedCell());
    }

    if (!currentDragOverCell) {
      return store;
    }

    if (PreviousPane === "Center") {
      scrollTowardsSticky(store, currentDragOverCell, currentPointerIdx);
    }
    if (PreviousPane === "Left" || PreviousPane === "Right") {
      scrollTowardsSticky(store, currentDragOverCell, currentPointerIdx, false, true);
    }
    if (PreviousPane === "TopCenter" || PreviousPane === "BottomCenter") {
      scrollTowardsSticky(store, currentDragOverCell, currentPointerIdx, true);
    }

    const cellContainer = getCellContainerFromPoint(clientX, clientY);
    if (!cellContainer) return store;

    const shouldSelectEntireColumn = store.pointerStartIdx.rowIndex === 0 && !!store.enableColumnSelectionOnFirstRow;
    const shouldEnableRowSelection = store.pointerStartIdx.colIndex === 0 && !!store.enableRowSelectionOnFirstColumn;

    return tryExpandingTowardsCell(store, {
      currentDragOverCell,
      startingPointerIdx: store.pointerStartIdx,
      currentPointerIdx,
      shouldSelectEntireColumn,
      shouldEnableRowSelection,
    });
  },

  handlePointerUp(event, store) {
    devEnvironment && console.log("CSB/handlePointerUp");

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

    const currentPointerIdx = getCellIndexesFromPointerLocation(clientX, clientY);

    const currentDragOverCell = store.getCellByIndexes(currentPointerIdx.rowIndex, currentPointerIdx.colIndex);

    if (!currentDragOverCell) {
      return store;
    }

    const isStickyCell = isCellSticky(store, currentDragOverCell);
    const cellContainer = (
      isStickyCell ? getCellContainer(store, currentDragOverCell) : getNonStickyCellContainer(clientX, clientY)
    ) as HTMLElement | undefined;

    if (!cellContainer) return store;

    const shouldSelectEntireColumn = store.pointerStartIdx.rowIndex === 0 && !!store.enableColumnSelectionOnFirstRow;
    const shouldEnableRowSelection = store.pointerStartIdx.colIndex === 0 && !!store.enableRowSelectionOnFirstColumn;

    if (cellContainer) {
      const scrollableParent = getScrollableParent(cellContainer as HTMLElement, true);
      const scrollableParentIsNotAWindow =
        scrollableParent && "clientWidth" in scrollableParent && "clientHeight" in scrollableParent;

      scrollableParentIsNotAWindow ? scrollToElementEdge({ x: clientX, y: clientY }, scrollableParent) : () => {};
      // TODO: scrollToWindowEdge({ x: clientX, y: clientY }); - function not implemented yet!
      // * scrollToWindowEdge - not possible to test in Ladle environment, due to clientX/Y acting like pageX/Y

      if (isStickyCell) {
        const nonStickyRowsAndColumns = getCellIndexesFromContainerElement(cellContainer);
        const currentPointerIdx = nonStickyRowsAndColumns || NO_CELL_LOCATION;

        return tryExpandingTowardsCell(store, {
          currentDragOverCell,
          startingPointerIdx: store.pointerStartIdx,
          currentPointerIdx,
          shouldSelectEntireColumn,
          shouldEnableRowSelection,
        });
      }
    }

    return tryExpandingTowardsCell(store, {
      currentDragOverCell,
      startingPointerIdx: store.pointerStartIdx,
      currentPointerIdx,
      shouldSelectEntireColumn,
      shouldEnableRowSelection,
    });
  },

  handlePointerEnterTouch(event, store) {
    return store;
  },
};
