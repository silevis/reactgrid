import { Behavior } from "../types/Behavior.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { calcSelectedAreaHeight } from "../utils/calcSelectedAreaHeight.ts";
import { findMinimalSelectedArea } from "../utils/findMinimalSelectedArea.ts";
import { getCellContainer } from "../utils/getCellContainer.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { getCellIndexesFromContainerElement } from "../utils/getCellIndexes.ts";
import { getCellIndexesFromPointerLocation } from "../utils/getCellIndexesFromPointerLocation.ts";
import { getLastRowMetrics } from "../utils/getLastRowMetrics.ts";
import { getCellPaneOverlap } from "../utils/getCellPaneOverlap.ts";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky.ts";
import { getHiddenFocusTargetLocation } from "../utils/getHiddenFocusTargetLocation.ts";
import { getCellArea } from "../utils/getCellArea.ts";
import { isCellInPane } from "../utils/isCellInPane.ts";
import { checkRowHasSpannedCell } from "../utils/checkRowHasSpannedCell.ts";

let initialMouseYPos = 0;
let mouseToCellTopBorderDistanceY = 0;
let destinationRowIdx = 0;

export const RowReorderBehavior: Behavior = {
  id: "RowReorder",
  handlePointerDown: function (event, store) {
    store.enableLogging && console.log("RRB/handlePointerDown");

    return store;
  },

  handlePointerMove: (event, store) => {
    store.enableLogging && console.log("RRB/handlePointerMove");

    return handlePointerMove(store, event);
  },

  handlePointerUp: function (event, store) {
    store.enableLogging && console.log("RRB/handlePointerUp");

    return handlePointerUp(store, event);
  },

  handleFocus: (event, store) => {
    store.enableLogging && console.log("RRB/handleFocus");

    const hiddenFocusTarget = document.activeElement;
    if (!hiddenFocusTarget) return store;

    const { rowIndex, colIndex } = getHiddenFocusTargetLocation(store.id, hiddenFocusTarget);
    if (rowIndex === -1 || colIndex === -1) return store;

    return {
      focusedLocation: { rowIndex, colIndex },
    };
  },

  handlePointerHold: function (event, store) {
    store.enableLogging && console.log("RRB/handlePointerHold");
    return store;
  },

  handlePointerHoldTouch: function (event, store) {
    store.enableLogging && console.log("RRB/handlePointerHoldTouch");
    return store;
  },

  handlePointerDownTouch: function (event, store) {
    store.enableLogging && console.log("RRB/handlePointerDownTouch");

    return store;
  },

  handlePointerMoveTouch: function (event, store) {
    store.enableLogging && console.log("RRB/handlePointerMoveTouch");

    return handlePointerMove(store, event);
  },

  handlePointerUpTouch: function (event, store) {
    store.enableLogging && console.log("RRB/handlePointerUpTouch");

    return handlePointerUp(store, event);
  },
};

const handlePointerMove = (store: ReactGridStore, event: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
  if (!initialMouseYPos) {
    initialMouseYPos = event.clientY;
  }

  const firstColumnCell = store.getCellByIndexes(0, 0);

  if (!firstColumnCell) return store;

  const firstColumnCellContainer = getCellContainer(store, firstColumnCell);
  if (!firstColumnCellContainer) return store;

  const firstColumnClientOffsetLeft = firstColumnCellContainer.getBoundingClientRect().left;

  // ensure appropriate rowIndex even if the cursor pointer is outside the grid
  const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(firstColumnClientOffsetLeft, event.clientY);

  const currentDragOverCell = store.getCellByIndexes(rowIndex, colIndex);

  if (currentDragOverCell) scrollTowardsSticky(store, currentDragOverCell, { rowIndex, colIndex }, false, true);

  const selectedAreaHeight = calcSelectedAreaHeight(store);

  const { lastRowRelativeOffsetTop, lastRowHeight } = getLastRowMetrics(store);

  const firstCellInSelectedArea = store.getCellByIndexes(store.selectedArea.startRowIdx, 0);
  if (!firstCellInSelectedArea) return store;

  const cellContainer = getCellContainer(store, firstCellInSelectedArea);

  if (!cellContainer) return store;

  const cellContainerOffsetTop = cellContainer.offsetTop || 0;

  const gridWrapperRectTop = store.reactGridRef?.getBoundingClientRect()?.top;

  if (gridWrapperRectTop === undefined) return store;

  // set the initial distance between the mouse and the top border of the cell
  if (!mouseToCellTopBorderDistanceY) {
    mouseToCellTopBorderDistanceY = event.clientY - gridWrapperRectTop - cellContainerOffsetTop;
  }

  let shadowPosition = event.clientY - gridWrapperRectTop - mouseToCellTopBorderDistanceY;

  const element = getCellContainerFromPoint(cellContainer.getBoundingClientRect().left, event.clientY);
  if (!element) return store;

  const pointerCellIndexes = getCellIndexesFromContainerElement(element);

  const pointerCell = store.getCellByIndexes(pointerCellIndexes.rowIndex, pointerCellIndexes.colIndex);
  if (!pointerCell) return store;

  const pointerCellArea = getCellArea(store, pointerCell);

  // In case a row can have spanned cells, it's necessary to find the minimal selected area
  const minimalSelection = findMinimalSelectedArea(store, {
    startRowIdx: pointerCellArea.startRowIdx,
    endRowIdx: pointerCellArea.endRowIdx,
    startColIdx: 0,
    endColIdx: store.columns.length,
  });

  const topCell = store.getCellByIndexes(minimalSelection.startRowIdx, minimalSelection.startColIdx);
  const bottomCell = store.getCellByIndexes(minimalSelection.endRowIdx - 1, minimalSelection.startColIdx);

  if (!topCell || !bottomCell) return store;

  const topCellContainer = getCellContainer(store, topCell);
  const bottomCellContainer = getCellContainer(store, bottomCell);

  if (!topCellContainer || !bottomCellContainer) return store;

  let linePosition = undefined;

  const crossesBottomLeftPane =
    store.selectedArea.startRowIdx < store.paneRanges.BottomLeft.startRowIdx &&
    store.selectedArea.endRowIdx > store.paneRanges.BottomLeft.startRowIdx;
  const crossesTopLeftPane =
    store.selectedArea.startRowIdx < store.paneRanges.TopLeft.endRowIdx &&
    store.selectedArea.endRowIdx > store.paneRanges.TopLeft.endRowIdx;

  if (crossesBottomLeftPane || crossesTopLeftPane) {
    linePosition = undefined;
  }
  // Determine the destination row index based on the cursor position and line position
  // Case 1 - Cursor is moving below the selected rows
  else if (event.clientY > cellContainer.getBoundingClientRect().top + selectedAreaHeight) {
    destinationRowIdx = minimalSelection.endRowIdx - 1;

    if (getCellPaneOverlap(store, { rowIndex: destinationRowIdx, colIndex: 0 }, "BottomCenter")) {
      linePosition = undefined;
    } else {
      const selectedAreaRowQuantity = store.selectedArea.endRowIdx - store.selectedArea.startRowIdx;
      const destinationStartRowIdx = destinationRowIdx + 1 - selectedAreaRowQuantity;

      // If the destination row is in the Bottom pane
      if (isCellInPane(store, bottomCell, "BottomLeft")) {
        if (destinationStartRowIdx >= store.paneRanges.BottomLeft.startRowIdx) {
          let rowSpannedCellTop;

          if (store.selectedArea.startRowIdx < store.paneRanges.TopLeft.endRowIdx) {
            rowSpannedCellTop = checkRowHasSpannedCell(
              store,
              store.paneRanges.TopLeft.endRowIdx + selectedAreaRowQuantity
            );
          }

          let rowSpannedCellBottom;
          if (store.selectedArea.endRowIdx <= store.paneRanges.BottomLeft.startRowIdx) {
            rowSpannedCellBottom = checkRowHasSpannedCell(
              store,
              store.paneRanges.BottomLeft.startRowIdx + selectedAreaRowQuantity
            );
          }

          if (!rowSpannedCellTop && !rowSpannedCellBottom) {
            linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
          }
        } else {
          let rowSpannedCellTop;

          if (store.selectedArea.startRowIdx < store.paneRanges.TopLeft.endRowIdx) {
            rowSpannedCellTop = checkRowHasSpannedCell(
              store,
              store.paneRanges.TopLeft.endRowIdx + selectedAreaRowQuantity
            );
          }

          const rowSpannedCellBottom = checkRowHasSpannedCell(
            store,
            store.selectedArea.endRowIdx - (destinationRowIdx + 1 - store.paneRanges.BottomCenter.startRowIdx)
          );

          if (!rowSpannedCellBottom && !rowSpannedCellTop) {
            linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
          }
        }
      } else if (
        store.selectedArea.startRowIdx < store.paneRanges.TopLeft.endRowIdx &&
        destinationRowIdx + 1 > store.paneRanges.TopLeft.endRowIdx
      ) {
        if (destinationStartRowIdx === store.paneRanges.TopLeft.endRowIdx) {
          linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
        } else if (destinationStartRowIdx < store.paneRanges.TopLeft.endRowIdx) {
          const rowSpannedCell = checkRowHasSpannedCell(
            store,
            store.selectedArea.endRowIdx - (destinationRowIdx + 1 - store.paneRanges.TopLeft.endRowIdx)
          );

          if (!rowSpannedCell) {
            linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
          }
        } else {
          const rowSpannedCell = checkRowHasSpannedCell(
            store,
            store.paneRanges.TopLeft.endRowIdx + selectedAreaRowQuantity
          );

          if (
            !rowSpannedCell ||
            ("originRowIndex" in rowSpannedCell &&
              rowSpannedCell!.originRowIndex - selectedAreaRowQuantity === store.paneRanges.TopLeft.endRowIdx)
          ) {
            linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
          }
        }
      } else {
        linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
      }
    }
  } else if (event.clientY < cellContainer.getBoundingClientRect().top - 1) {
    // Case 2 - Cursor is moving above the selected rows
    destinationRowIdx = minimalSelection.startRowIdx;

    if (getCellPaneOverlap(store, { rowIndex: destinationRowIdx, colIndex: 0 }, "TopCenter")) {
      linePosition = undefined;
    } else {
      const selectedAreaRowQuantity = store.selectedArea.endRowIdx - store.selectedArea.startRowIdx;
      const destinationEndRowIdx = destinationRowIdx + selectedAreaRowQuantity;

      // If the destination row is in the Top pane
      if (isCellInPane(store, topCell, "TopLeft")) {
        if (store.selectedArea.endRowIdx <= store.paneRanges.TopLeft.endRowIdx) {
          linePosition = topCellContainer.offsetTop;
        } else if (destinationEndRowIdx <= store.paneRanges.TopLeft.endRowIdx) {
          let rowSpannedCellBottom;

          if (store.selectedArea.endRowIdx > store.paneRanges.BottomLeft.startRowIdx) {
            rowSpannedCellBottom = checkRowHasSpannedCell(
              store,
              store.paneRanges.BottomLeft.startRowIdx - selectedAreaRowQuantity
            );
          }

          const rowSpannedCellTop = checkRowHasSpannedCell(
            store,
            store.paneRanges.TopLeft.endRowIdx - selectedAreaRowQuantity
          );

          if (
            (!rowSpannedCellTop && !rowSpannedCellBottom) ||
            (rowSpannedCellTop &&
              "originRowIndex" in rowSpannedCellTop &&
              rowSpannedCellTop!.originRowIndex + selectedAreaRowQuantity === store.paneRanges.TopLeft.endRowIdx)
          ) {
            linePosition = topCellContainer.offsetTop;
          }
        }
      } else if (
        store.selectedArea.endRowIdx > store.paneRanges.BottomLeft.startRowIdx &&
        destinationRowIdx < store.paneRanges.BottomLeft.startRowIdx
      ) {
        if (destinationEndRowIdx > store.paneRanges.BottomLeft.startRowIdx) {
          const rowSpannedCell = checkRowHasSpannedCell(
            store,
            store.selectedArea.startRowIdx + (store.paneRanges.BottomLeft.startRowIdx - destinationRowIdx)
          );

          if (!rowSpannedCell) {
            linePosition = topCellContainer.offsetTop;
          }
        } else {
          const rowSpannedCell = checkRowHasSpannedCell(
            store,
            store.paneRanges.BottomLeft.startRowIdx - selectedAreaRowQuantity
          );

          if (!rowSpannedCell) {
            linePosition = topCellContainer.offsetTop;
          }
        }
      } else {
        linePosition = topCellContainer.offsetTop;
      }
    }
  }

  // Ensure the shadow doesn't go above the first row
  if (shadowPosition < 0) {
    shadowPosition = 0;
  }

  // Ensure the shadow doesn't go below the last row
  if (shadowPosition + selectedAreaHeight >= lastRowRelativeOffsetTop + lastRowHeight) {
    shadowPosition = lastRowRelativeOffsetTop + lastRowHeight - selectedAreaHeight;
  }

  if (!store.rows[rowIndex].reorderable) {
    return {
      ...store,
      shadowSize: selectedAreaHeight,
      shadowPosition: shadowPosition,
      linePosition: undefined,
    };
  }

  return {
    ...store,
    shadowSize: selectedAreaHeight,
    shadowPosition: shadowPosition,
    linePosition,
  };
};

const handlePointerUp = (
  store: ReactGridStore,
  event: React.PointerEvent<HTMLDivElement> | PointerEvent
): Partial<ReactGridStore> => {
  mouseToCellTopBorderDistanceY = 0;

  // Prevent triggering the resize behavior when a row is selected twice without moving the pointer
  if (!initialMouseYPos)
    return { ...store, lineOrientation: "vertical", currentBehavior: store.getBehavior("Default") };

  if (!store.linePosition) {
    initialMouseYPos = 0;
    if (!initialMouseYPos)
      return {
        ...store,
        currentBehavior: store.getBehavior("Default"),
        shadowPosition: undefined,
        lineOrientation: "vertical",
        shadowSize: undefined,
      };
  }

  initialMouseYPos = 0;

  const selectedRowIndexes = Array.from(
    { length: store.selectedArea.endRowIdx - store.selectedArea.startRowIdx },
    (_, i) => i + store.selectedArea.startRowIdx
  );

  const isUpDirection = !!selectedRowIndexes.find((idx) => idx > destinationRowIdx);

  const isFocusedCellInSelectedArea = selectedRowIndexes.includes(store.focusedLocation.rowIndex);

  let newFocusedLocation = store.focusedLocation;

  if (isFocusedCellInSelectedArea) {
    const offset = store.focusedLocation.rowIndex - store.selectedArea.startRowIdx;
    newFocusedLocation = {
      rowIndex: isUpDirection
        ? destinationRowIdx + offset
        : destinationRowIdx - (selectedRowIndexes.length - 1) + offset,
      colIndex: store.focusedLocation.colIndex,
    };
  } else if (
    isUpDirection &&
    store.selectedArea.startRowIdx > store.focusedLocation.rowIndex &&
    destinationRowIdx <= store.focusedLocation.rowIndex
  ) {
    const offset = store.selectedArea.endRowIdx - store.selectedArea.startRowIdx;
    newFocusedLocation = {
      rowIndex: store.focusedLocation.rowIndex + offset,
      colIndex: store.focusedLocation.colIndex,
    };
  } else if (
    !isUpDirection &&
    store.selectedArea.endRowIdx <= store.focusedLocation.rowIndex &&
    destinationRowIdx >= store.focusedLocation.rowIndex
  ) {
    const offset = store.selectedArea.endRowIdx - store.selectedArea.startRowIdx;
    newFocusedLocation = {
      rowIndex: store.focusedLocation.rowIndex - offset,
      colIndex: store.focusedLocation.colIndex,
    };
  }

  const { lastRowHeight, lastRowClientOffsetTop } = getLastRowMetrics(store);

  // CASE 1
  // If the mouse pointer is beyond the last row, move the selected rows to the last row
  if (event.clientY > lastRowClientOffsetTop + lastRowHeight) {
    try {
      store.onRowReorder?.(selectedRowIndexes, store.rows.length - 1);
    } catch (e) {
      console.error(e);
    }

    return {
      currentBehavior: store.getBehavior("Default"),
      changedFocusedLocation: newFocusedLocation,
      selectedArea: {
        startRowIdx: store.rows.length - 1 - (selectedRowIndexes.length - 1),
        endRowIdx: store.rows.length,
        startColIdx: 0,
        endColIdx: store.columns.length,
      },
      shadowPosition: undefined,
      linePosition: undefined,
      lineOrientation: "vertical",
      shadowSize: undefined,
    };
  }

  const gridWrapper = store.reactGridRef;
  if (!gridWrapper) return store;

  // CASE 2
  // If the mouse pointer is beyond the first row, move the selected rows to the first row
  if (event.clientY < gridWrapper.getBoundingClientRect().top) {
    try {
      store.onRowReorder?.(selectedRowIndexes, 0);
    } catch (e) {
      console.error(e);
    }

    return {
      currentBehavior: store.getBehavior("Default"),
      changedFocusedLocation: newFocusedLocation,
      selectedArea: {
        startRowIdx: 0,
        endRowIdx: 0 + selectedRowIndexes.length,
        startColIdx: 0,
        endColIdx: store.columns.length,
      },
      shadowPosition: undefined,
      linePosition: undefined,
      lineOrientation: "vertical",
      shadowSize: undefined,
    };
  }

  const firstSelectedCell = store.getCellByIndexes(store.selectedArea.startRowIdx, 0);
  if (!firstSelectedCell) return store;

  const cellContainer = getCellContainer(store, firstSelectedCell);
  if (!cellContainer) return store;

  // CASE 3
  // If the mouse pointer is within the first and last row, move the selected rows to the destination row

  try {
    store.onRowReorder?.(selectedRowIndexes, destinationRowIdx);
  } catch (e) {
    console.error(e);
  }

  return {
    currentBehavior: store.getBehavior("Default"),
    changedFocusedLocation: newFocusedLocation,
    selectedArea: {
      startRowIdx: isUpDirection ? destinationRowIdx : destinationRowIdx - (selectedRowIndexes.length - 1),
      endRowIdx: isUpDirection ? destinationRowIdx + selectedRowIndexes.length : destinationRowIdx + 1,
      startColIdx: 0,
      endColIdx: store.columns.length,
    },
    shadowPosition: undefined,
    linePosition: undefined,
    lineOrientation: "vertical",
    shadowSize: undefined,
  };
};
