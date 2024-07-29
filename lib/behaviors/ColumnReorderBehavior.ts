import { Behavior } from "../types/Behavior.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { calcSelectedAreaWidth } from "../utils/calcSelectedAreaWidth.ts";
import { findMinimalSelectedArea } from "../utils/findMinimalSelectedArea.ts";
import { getCellContainer } from "../utils/getCellContainer.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { getCellIndexesFromContainerElement } from "../utils/getCellIndexes.ts";
import { getCellIndexesFromPointerLocation } from "../utils/getCellIndexesFromPointerLocation.ts";
import { getLastColumnMetrics } from "../utils/getLastColumnMetrics.ts";
import { getCellPaneOverlap } from "../utils/getCellPaneOverlap.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky.ts";
import { getHiddenFocusTargetLocation } from "../utils/getHiddenFocusTargetLocation.ts";
import { isCellInPane } from "../utils/isCellInPane.ts";
import { getCellArea } from "../utils/getCellArea.ts";

const devEnvironment = isDevEnvironment();

let initialMouseXPos = 0;
let mouseToCellLeftBorderDistanceX = 0;
let destinationColIdx = 0;

export const ColumnReorderBehavior: Behavior = {
  id: "ColumnReorder",
  handlePointerDown: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerDown");

    return store;
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("CRB/handlePointerMove");

    return handlePointerMove(store, event);
  },

  handlePointerUp: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerUp");

    return handlePointerUp(store, event);
  },

  handlePointerHold: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerHold");
    return store;
  },

  handleFocus: (event, store) => {
    devEnvironment && console.log("CRB/handleFocus");

    const hiddenFocusTarget = document.activeElement;
    if (!hiddenFocusTarget) return store;

    const { rowIndex, colIndex } = getHiddenFocusTargetLocation(hiddenFocusTarget);
    if (rowIndex === -1 || colIndex === -1) return store;

    return {
      focusedLocation: { rowIndex, colIndex },
    };
  },

  handlePointerHoldTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerHoldTouch");
    return store;
  },

  handlePointerDownTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerDownTouch");

    return store;
  },

  handlePointerMoveTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerMoveTouch");

    return handlePointerMove(store, event);
  },

  handlePointerUpTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerUpTouch");

    return handlePointerUp(store, event);
  },
};

const handlePointerMove = (
  store: ReactGridStore,
  event: React.PointerEvent<HTMLDivElement> | PointerEvent
): Partial<ReactGridStore> => {
  devEnvironment && console.log("CRB/handlePointerMove");

  if (!initialMouseXPos) {
    initialMouseXPos = event.clientX;
  }

  const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(event.clientX, event.clientY);

  const currentDragOverCell = store.getCellByIndexes(rowIndex, colIndex);

  if (currentDragOverCell) scrollTowardsSticky(store, currentDragOverCell, { rowIndex, colIndex }, true);

  const selectedAreaWidth = calcSelectedAreaWidth(store);

  const { lastColumnRelativeffsetLeft, lastColumnCellWidth } = getLastColumnMetrics(store);

  const firstCellInSelectedArea = store.getCellByIndexes(0, store.selectedArea.startColIdx);

  if (!firstCellInSelectedArea) return store;

  const cellContainer = getCellContainer(store, firstCellInSelectedArea);

  if (!cellContainer) return store;

  const cellContainerOffsetLeft = cellContainer.offsetLeft || 0;

  const gridWrapperRectLeft = store.reactGridRef?.getBoundingClientRect()?.left;

  if (gridWrapperRectLeft === undefined) return store;

  // set the initial distance between the mouse and the left border of the cell
  if (!mouseToCellLeftBorderDistanceX) {
    mouseToCellLeftBorderDistanceX = event.clientX - gridWrapperRectLeft - cellContainerOffsetLeft;
  }

  let shadowPosition = event.clientX - gridWrapperRectLeft - mouseToCellLeftBorderDistanceX;

  // Use client rect instead of event.clientY to determine shadow position,
  // This allows for accurate positioning even when the cursor is not hovering directly over the cell container.
  const element = getCellContainerFromPoint(event.clientX, cellContainer.getBoundingClientRect().top);

  if (!element) return store;

  const cell = getCellIndexesFromContainerElement(element);

  if (!cell) return store;

  // In case a column can have spanned cells, it's necessary to find the minimal selected area
  const minimalSelection = findMinimalSelectedArea(store, {
    startRowIdx: 0,
    endRowIdx: store.rows.length,
    startColIdx: cell.colIndex,
    endColIdx: cell.colIndex + 1,
  });

  const leftCell = store.getCellByIndexes(minimalSelection.startRowIdx, minimalSelection.startColIdx);
  const rightCell = store.getCellByIndexes(minimalSelection.startRowIdx, minimalSelection.endColIdx - 1);

  if (!leftCell || !rightCell) return store;

  const leftCellContainer = getCellContainer(store, leftCell);
  const rightCellContainer = getCellContainer(store, rightCell);

  if (!leftCellContainer || !rightCellContainer) return store;

  let linePosition = undefined;

  // Determine the destination column index based on the cursor position and line position
  // Case 1 - Cursor is moving to the right of the selected columns
  if (event.clientX > cellContainer.getBoundingClientRect().left + selectedAreaWidth) {
    destinationColIdx = minimalSelection.endColIdx - 1;

    if (getCellPaneOverlap(store, { rowIndex: 0, colIndex: destinationColIdx }, "Right")) {
      linePosition = undefined;
    } else {
      const selectedAreaColQuantity = store.selectedArea.endColIdx - store.selectedArea.startColIdx;
      const destinationStartColIdx = destinationColIdx + 1 - selectedAreaColQuantity;

      // If the destination column is in the Right pane
      if (isCellInPane(store, rightCell, "TopRight")) {
        // If initial selected area is fully in the Right pane
        if (store.selectedArea.startColIdx >= store.paneRanges.Right.startColIdx) {
          linePosition = rightCellContainer.offsetLeft + rightCellContainer.offsetWidth;
        }
        // If reordered selected columns are going to be fully to the left of the Right pane
        else if (destinationStartColIdx >= store.paneRanges.Right.startColIdx) {
          let colSpannedCellLeft;
          // If initial selected area is in the Left pane and reordered selected columns are going to be partly to the right of the Right pane
          if (store.selectedArea.startColIdx < store.paneRanges.TopLeft.endColIdx) {
            const colIndex = store.paneRanges.TopLeft.endColIdx + selectedAreaColQuantity;

            for (let rowIndex = 0; rowIndex < store.cells.length; rowIndex++) {
              const cell = store.cells[rowIndex][colIndex];
              const cellArea = getCellArea(store, cell);
              if ("originColIndex" in cell && cellArea.endColIdx - cellArea.startColIdx > 1) {
                colSpannedCellLeft = cell;
                break;
              }
            }
          }

          const colIndex = store.paneRanges.Right.endColIdx - selectedAreaColQuantity;
          let colSpannedCellRight = null;

          // Iterate over each row in the specified column
          for (let rowIndex = 0; rowIndex < store.cells.length; rowIndex++) {
            const cell = store.cells[rowIndex][colIndex];
            const cellArea = getCellArea(store, cell);
            if ("originColIndex" in cell && cellArea.endColIdx - cellArea.startColIdx > 1) {
              colSpannedCellRight = cell;
              break;
            }
          }

          // If there is no spanned cell that will be partly to the left of the Right pane - then show the line
          if (!colSpannedCellLeft && !colSpannedCellRight) {
            linePosition = rightCellContainer.offsetLeft + rightCellContainer.offsetWidth;
          }
        }
        // Check if selected area has not spanned cell at col idx equal to the start col idx of the Right pane
        else {
          let colSpannedCellLeft;
          // If initial selected area is in the Left pane and reordered selected columns are going to be partly to the right of the Right pane
          if (store.selectedArea.startColIdx < store.paneRanges.TopLeft.endColIdx) {
            const colIndex = store.paneRanges.Left.endColIdx + selectedAreaColQuantity;

            for (let rowIndex = 0; rowIndex < store.cells.length; rowIndex++) {
              const cell = store.cells[rowIndex][colIndex];
              const cellArea = getCellArea(store, cell);
              if ("originColIndex" in cell && cellArea.endColIdx - cellArea.startColIdx > 1) {
                colSpannedCellLeft = cell;
                break;
              }
            }
          }

          const colIndex = store.selectedArea.endColIdx - (destinationColIdx + 1 - store.paneRanges.Right.startColIdx);
          let colSpannedCellRight = null;

          // Iterate over each row in the specified column
          for (let rowIndex = 0; rowIndex < store.cells.length; rowIndex++) {
            const cell = store.cells[rowIndex][colIndex];
            const cellArea = getCellArea(store, cell);
            if ("originColIndex" in cell && cellArea.endColIdx - cellArea.startColIdx > 1) {
              colSpannedCellRight = cell;
              break;
            }
          }

          // Same as above - if there are no spanned cells that will be moved to the left - show the line
          if (!colSpannedCellRight && !colSpannedCellLeft) {
            linePosition = rightCellContainer.offsetLeft + rightCellContainer.offsetWidth;
          }
        }
      }
      // If the destination column is to the right of the Left pane but selected area start col idx is in the Left pane
      else if (
        store.selectedArea.startColIdx < store.paneRanges.TopLeft.endColIdx &&
        destinationColIdx + 1 > store.paneRanges.TopLeft.endColIdx
      ) {
        if (destinationStartColIdx === store.paneRanges.TopLeft.endColIdx) {
          linePosition = rightCellContainer.offsetLeft + rightCellContainer.offsetWidth;
        } else if (destinationStartColIdx < store.paneRanges.TopLeft.endColIdx) {
          // If reordered selected columns are going to be partly in the Left pane
          // Check if there will be a spanned cell that will be partly in the Left pane - after reorder
          const colSpannedCell = store.cells[
            store.selectedArea.endColIdx - (destinationColIdx - store.paneRanges.TopLeft.endColIdx)
          ].find((cell) => {
            const cellArea = getCellArea(store, cell);
            return "originColIndex" in cell && cellArea.endColIdx - cellArea.startColIdx > 1;
          });

          // If there is no spanned cell that will be partly in the Left pane - then show the line
          if (!colSpannedCell) {
            linePosition = rightCellContainer.offsetLeft + rightCellContainer.offsetWidth;
          }
        } else {
          const colIndex = store.paneRanges.TopLeft.endColIdx + selectedAreaColQuantity;
          let colSpannedCell = null;

          // Iterate over each row in the specified column
          for (let rowIndex = 0; rowIndex < store.cells.length; rowIndex++) {
            const cell = store.cells[rowIndex][colIndex];
            const cellArea = getCellArea(store, cell);
            if ("originColIndex" in cell && cellArea.endColIdx - cellArea.startColIdx > 1) {
              colSpannedCell = cell;
              break;
            }
          }

          if (
            !colSpannedCell ||
            ("originColIndex" in colSpannedCell &&
              colSpannedCell.originColIndex + selectedAreaColQuantity === store.paneRanges.TopLeft.endColIdx)
          ) {
            linePosition = rightCellContainer.offsetLeft + rightCellContainer.offsetWidth;
          }
        }
      }
      // If destination column is between the Left and Right panes - no need to check for spanned cells - just show the line
      else {
        linePosition = rightCellContainer.offsetLeft + rightCellContainer.offsetWidth;
      }
    }
  } else if (event.clientX < cellContainer.getBoundingClientRect().left - 1) {
    // Case 2 - Cursor is moving to the left of the selected columns
    destinationColIdx = minimalSelection.startColIdx;

    if (getCellPaneOverlap(store, { rowIndex: 0, colIndex: destinationColIdx }, "Left")) {
      linePosition = undefined;
    } else {
      const selectedAreaColQuantity = store.selectedArea.endColIdx - store.selectedArea.startColIdx;
      const destinationEndColIdx = destinationColIdx + selectedAreaColQuantity;
      linePosition = leftCellContainer.offsetLeft;
      // if (isCellInPane(store, leftCell, "Left")) {
      //   if (store.selectedArea.endColIdx - store.paneRanges.Left.endColIdx) {
      //     {
      //       linePosition = leftCellContainer.offsetLeft;
      //     }
      //   } else if (destinationEndColIdx <= store.paneRanges.Left.endColIdx) {
      //     linePosition = leftCellContainer.offsetLeft;
      //   } else {

      //   }
      // }
    }
  }

  // Ensure the shadow doesn't go beyond the first column
  if (shadowPosition < 0) {
    shadowPosition = 0;
  }

  // Ensure the shadow doesn't go beyond the last column
  if (shadowPosition + selectedAreaWidth >= lastColumnRelativeffsetLeft + lastColumnCellWidth) {
    shadowPosition = lastColumnRelativeffsetLeft + lastColumnCellWidth - selectedAreaWidth;
  }

  return {
    ...store,
    shadowSize: selectedAreaWidth,
    shadowPosition: shadowPosition,
    linePosition,
  };
};

const handlePointerUp = (
  store: ReactGridStore,
  event: React.PointerEvent<HTMLDivElement> | PointerEvent
): Partial<ReactGridStore> => {
  mouseToCellLeftBorderDistanceX = 0;

  // const focusedCell = store.getFocusedCell();

  // Prevent triggering the resize behavior when a column is selected twice without moving the pointer
  if (!initialMouseXPos) return { ...store, currentBehavior: store.getBehavior("Default") };

  if (!store.linePosition) {
    initialMouseXPos = 0;

    if (!initialMouseXPos)
      return {
        ...store,
        currentBehavior: store.getBehavior("Default"),
        shadowPosition: undefined,
        shadowSize: undefined,
      };
  }

  initialMouseXPos = 0;

  const selectedColIndexes = Array.from(
    { length: store.selectedArea.endColIdx - store.selectedArea.startColIdx },
    (_, i) => i + store.selectedArea.startColIdx
  );

  const isLeftDirection = !!selectedColIndexes.find((idx) => idx > destinationColIdx);

  const isFocusedCellInSelectedArea = selectedColIndexes.includes(store.focusedLocation.colIndex);

  let newFocusedLocation = store.focusedLocation;

  if (isFocusedCellInSelectedArea) {
    const offset = store.focusedLocation.colIndex - store.selectedArea.startColIdx;
    newFocusedLocation = {
      rowIndex: store.focusedLocation.rowIndex,
      colIndex: isLeftDirection
        ? destinationColIdx + offset
        : destinationColIdx - (selectedColIndexes.length - 1) + offset,
    };
  } else if (
    isLeftDirection &&
    store.selectedArea.startColIdx > store.focusedLocation.colIndex &&
    destinationColIdx <= store.focusedLocation.colIndex
  ) {
    const offset = store.selectedArea.endColIdx - store.selectedArea.startColIdx;
    newFocusedLocation = {
      rowIndex: store.focusedLocation.rowIndex,
      colIndex: store.focusedLocation.colIndex + offset,
    };
  } else if (
    !isLeftDirection &&
    store.selectedArea.endColIdx <= store.focusedLocation.colIndex &&
    destinationColIdx >= store.focusedLocation.colIndex
  ) {
    const offset = store.selectedArea.endColIdx - store.selectedArea.startColIdx;
    newFocusedLocation = {
      rowIndex: store.focusedLocation.rowIndex,
      colIndex: store.focusedLocation.colIndex - offset,
    };
  }

  const { lastColumnCellWidth, lastColumnClientOffsetLeft } = getLastColumnMetrics(store);

  // CASE 1
  // If the mouse pointer is beyond the last column, move the selected columns to the last column
  if (event.clientX > lastColumnClientOffsetLeft + lastColumnCellWidth) {
    store.onColumnReorder?.(selectedColIndexes, store.columns.length - 1);

    return {
      currentBehavior: store.getBehavior("Default"),
      changedFocusedLocation: newFocusedLocation,
      selectedArea: {
        startRowIdx: 0,
        endRowIdx: store.rows.length,
        startColIdx: store.columns.length - 1 - (selectedColIndexes.length - 1),
        endColIdx: store.columns.length,
      },
      shadowPosition: undefined,
      linePosition: undefined,
      shadowSize: undefined,
    };
  }

  const gridWrapper = store.reactGridRef;

  if (!gridWrapper) return store;

  // CASE 2
  // If the mouse pointer is beyond the first column, move the selected columns to the first column
  if (event.clientX < gridWrapper.getBoundingClientRect().left) {
    store.onColumnReorder?.(selectedColIndexes, 0);

    return {
      currentBehavior: store.getBehavior("Default"),
      changedFocusedLocation: newFocusedLocation,
      selectedArea: {
        startRowIdx: 0,
        endRowIdx: store.rows.length,
        startColIdx: 0,
        endColIdx: 0 + selectedColIndexes.length,
      },
      shadowPosition: undefined,
      linePosition: undefined,
      shadowSize: undefined,
    };
  }

  const firstSelectedHeaderCell = store.getCellByIndexes(0, store.selectedArea.startColIdx);

  if (!firstSelectedHeaderCell) return store;

  const cellContainer = getCellContainer(store, firstSelectedHeaderCell);

  if (!cellContainer) return store;

  // CASE 3
  // If the mouse pointer is within the first and last column, move the selected columns to the destination column
  store.onColumnReorder?.(selectedColIndexes, destinationColIdx);

  return {
    currentBehavior: store.getBehavior("Default"),
    changedFocusedLocation: newFocusedLocation,
    selectedArea: {
      startRowIdx: 0,
      endRowIdx: store.rows.length,
      startColIdx: isLeftDirection ? destinationColIdx : destinationColIdx - (selectedColIndexes.length - 1),
      endColIdx: isLeftDirection ? destinationColIdx + selectedColIndexes.length : destinationColIdx + 1,
    },
    shadowPosition: undefined,
    linePosition: undefined,
    shadowSize: undefined,
  };
};
