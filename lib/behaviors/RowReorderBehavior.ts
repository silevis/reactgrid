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
import isDevEnvironment from "../utils/isDevEnvironment.ts";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky.ts";
import { getHiddenFocusTargetLocation } from "../utils/getHiddenFocusTargetLocation.ts";
import { getCellArea } from "../utils/getCellArea.ts";
import { isCellInPane } from "../utils/isCellInPane.ts";

const devEnvironment = isDevEnvironment();

let initialMouseYPos = 0;
let mouseToCellTopBorderDistanceY = 0;
let destinationRowIdx = 0;

export const RowReorderBehavior: Behavior = {
  id: "RowReorder",
  handlePointerDown: function (event, store) {
    devEnvironment && console.log("RRB/handlePointerDown");

    return store;
  },

  handlePointerMove: (event, store) => {
    // devEnvironment && console.log("RRB/handlePointerMove");

    return handlePointerMove(store, event);
  },

  handlePointerUp: function (event, store) {
    devEnvironment && console.log("RRB/handlePointerUp");

    return handlePointerUp(store, event);
  },

  handleFocus: (event, store) => {
    devEnvironment && console.log("RRB/handleFocus");

    const hiddenFocusTarget = document.activeElement;
    if (!hiddenFocusTarget) return store;

    const { rowIndex, colIndex } = getHiddenFocusTargetLocation(hiddenFocusTarget);
    if (rowIndex === -1 || colIndex === -1) return store;

    return {
      focusedLocation: { rowIndex, colIndex },
    };
  },

  handlePointerHold: function (event, store) {
    devEnvironment && console.log("RRB/handlePointerHold");
    return store;
  },

  handlePointerHoldTouch: function (event, store) {
    devEnvironment && console.log("RRB/handlePointerHoldTouch");
    return store;
  },

  handlePointerDownTouch: function (event, store) {
    devEnvironment && console.log("RRB/handlePointerDownTouch");

    return store;
  },

  handlePointerMoveTouch: function (event, store) {
    devEnvironment && console.log("RRB/handlePointerMoveTouch");

    return handlePointerMove(store, event);
  },

  handlePointerUpTouch: function (event, store) {
    devEnvironment && console.log("RRB/handlePointerUpTouch");

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

  // Determine the destination row index based on the cursor position and line position
  // Case 1 - Cursor is moving below the selected rows
  if (event.clientY > cellContainer.getBoundingClientRect().top + selectedAreaHeight) {
    destinationRowIdx = minimalSelection.endRowIdx - 1;

    if (getCellPaneOverlap(store, { rowIndex: destinationRowIdx, colIndex: 0 }, "BottomCenter")) {
      linePosition = undefined;
    } else {
      const selectedAreaRowQuantity = store.selectedArea.endRowIdx - store.selectedArea.startRowIdx;
      const destinationStartRowIdx = destinationRowIdx + 1 - selectedAreaRowQuantity;

      // If the destination row is in the Bottom pane
      if (isCellInPane(store, bottomCell, "BottomLeft")) {
        // If initial selected area is fully in the Bottom pane
        if (destinationStartRowIdx === store.paneRanges.BottomLeft.startRowIdx) {
          linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
        }
        // If reordered selected rows are going to be fully above the Bottom pane
        else if (destinationStartRowIdx >= store.paneRanges.BottomLeft.startRowIdx) {
          let rowSpannedCellTop;
          // If initial selected area is in the Top pane and reordered selected rows are going to be partly below the Bottom pane
          if (store.selectedArea.startRowIdx < store.paneRanges.TopLeft.endRowIdx) {
            // Check if there will be a spanned cell that will be partly above the Top pane - after reorder
            rowSpannedCellTop = store.cells[store.paneRanges.TopLeft.endRowIdx + selectedAreaRowQuantity].find(
              (cell) => {
                const cellArea = getCellArea(store, cell);
                return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
              }
            );
          }

          // Check if there will be a spanned cell that will be partly above the Bottom pane - after reorder
          const rowSpannedCellBottom = store.cells[
            store.paneRanges.BottomLeft.startRowIdx + selectedAreaRowQuantity
          ].find((cell) => {
            const cellArea = getCellArea(store, cell);
            return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
          });

          // If there is no spanned cell that will be partly above the Bottom pane - then show the line
          if (!rowSpannedCellTop && !rowSpannedCellBottom) {
            linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
          }
        }
        // Check if selected area has not spanned cell at row idx equal to the start row idx of the Bottom pane
        else {
          let rowSpannedCellTop;
          // If initial selected area is in the Top pane and reordered selected rows are going to be partly below the Bottom pane
          if (store.selectedArea.startRowIdx < store.paneRanges.TopLeft.endRowIdx) {
            // Check if there will be a spanned cell that will be partly above the Top pane - after reorder
            rowSpannedCellTop = store.cells[store.paneRanges.TopLeft.endRowIdx + selectedAreaRowQuantity].find(
              (cell) => {
                const cellArea = getCellArea(store, cell);
                if (cellArea.endRowIdx - cellArea.startRowIdx > 1) {
                  return true;
                }
              }
            );
          }

          const rowSpannedCellBottom = store.cells[
            store.selectedArea.startRowIdx + (destinationRowIdx + 1 - store.paneRanges.BottomLeft.startRowIdx)
          ].find((cell) => {
            const cellArea = getCellArea(store, cell);
            return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
          });

          // Same as above - if there are no spanned cells that will be moved to the top - show the line
          if (!rowSpannedCellBottom && !rowSpannedCellTop) {
            linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
          }
        }
      }
      // If the destination row is below the Top pane but selected area start row idx is in the Top pane
      else if (
        store.selectedArea.startRowIdx < store.paneRanges.TopLeft.endRowIdx &&
        destinationRowIdx + 1 > store.paneRanges.TopLeft.endRowIdx
      ) {
        if (destinationStartRowIdx === store.paneRanges.TopLeft.endRowIdx) {
          linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
        } else if (destinationStartRowIdx < store.paneRanges.TopLeft.endRowIdx) {
          // If reordered selected rows are going to be partly in the Top pane
          // Check if there will be a spanned cell that will be partly in the Top pane - after reorder
          const rowSpannedCell = store.cells[
            store.selectedArea.endRowIdx - (destinationRowIdx + 1 - store.paneRanges.TopLeft.endRowIdx)
          ].find((cell) => {
            const cellArea = getCellArea(store, cell);
            return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
          });

          // If there is no spanned cell that will be partly in the Top pane - then show the line
          if (!rowSpannedCell) {
            linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
          }
        }
        // If reordered selected rows are going to be fully below the Top pane - now need to check if there are no spanned cells that now will be moved to top
        else {
          const rowSpannedCell = store.cells[store.paneRanges.TopLeft.endRowIdx + selectedAreaRowQuantity].find(
            (cell) => {
              const cellArea = getCellArea(store, cell);
              return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
            }
          );

          if (
            !rowSpannedCell ||
            ("originRowIndex" in rowSpannedCell &&
              rowSpannedCell!.originRowIndex - selectedAreaRowQuantity === store.paneRanges.TopLeft.endRowIdx)
          ) {
            linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
          }
        }
      }
      // If destination row is between the Top and Bottom panes - no need to check for spanned cells - just show the line
      else {
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
        // If initial selected area is fully in the Top pane
        if (store.selectedArea.endRowIdx <= store.paneRanges.TopLeft.endRowIdx) {
          linePosition = topCellContainer.offsetTop;
        }
        // If reordered selected rows are going to be fully below the Top pane
        else if (destinationEndRowIdx <= store.paneRanges.TopLeft.endRowIdx) {
          let rowSpannedCellBottom;
          // If initial selected area is in the Bottom pane and reordered selected rows are going to be partly above the Top pane
          if (store.selectedArea.endRowIdx > store.paneRanges.BottomLeft.startRowIdx) {
            // Check if there will be a spanned cell that will be partly below the Bottom pane - after reorder
            rowSpannedCellBottom = store.cells[store.paneRanges.BottomLeft.startRowIdx - selectedAreaRowQuantity].find(
              (cell) => {
                const cellArea = getCellArea(store, cell);
                return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
              }
            );
          }

          // Check if there will be a spanned cell that will be partly below the Top pane - after reorder
          const rowSpannedCellTop = store.cells[store.paneRanges.TopLeft.endRowIdx - selectedAreaRowQuantity].find(
            (cell) => {
              const cellArea = getCellArea(store, cell);
              return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
            }
          );

          // If there is no spanned cell that will be partly below the Top pane - then show the line
          if (
            (!rowSpannedCellTop && !rowSpannedCellBottom) ||
            (rowSpannedCellTop &&
              "originRowIndex" in rowSpannedCellTop &&
              rowSpannedCellTop!.originRowIndex + selectedAreaRowQuantity === store.paneRanges.TopLeft.endRowIdx)
          ) {
            linePosition = topCellContainer.offsetTop;
          }
        }
      }
      // If the destination row is above the Bottom pane but selected area end row idx is in the Bottom pane
      else if (
        store.selectedArea.endRowIdx > store.paneRanges.BottomLeft.startRowIdx &&
        destinationRowIdx < store.paneRanges.BottomLeft.startRowIdx
      ) {
        // If reordered selected rows are going to be partly in the Bottom pane
        if (destinationEndRowIdx > store.paneRanges.BottomLeft.startRowIdx) {
          // Check if there will be a spanned cell that will be partly in the Bottom pane - after reorder
          const rowSpannedCell = store.cells[
            store.selectedArea.startRowIdx + (store.paneRanges.BottomLeft.startRowIdx - destinationRowIdx)
          ].find((cell) => {
            const cellArea = getCellArea(store, cell);
            return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
          });

          // If there is no spanned cell that will be partly in the Bottom pane - then show the line
          if (!rowSpannedCell) {
            linePosition = topCellContainer.offsetTop;
          }
        }
        // If reordered selected rows are going to be fully above the Bottom pane - now need to check if there are no spanned cells that now will be moved to bottom
        else {
          const rowSpannedCell = store.cells[store.paneRanges.BottomLeft.startRowIdx - selectedAreaRowQuantity].find(
            (cell) => {
              const cellArea = getCellArea(store, cell);
              return "originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1;
            }
          );

          // Same as above - if there are no spanned cells that will be moved to the bottom - show the line
          if (!rowSpannedCell) {
            linePosition = topCellContainer.offsetTop;
          }
        }
      }
      // If destination row is between the Top and Bottom panes - no need to check for spanned cells - just show the line
      else {
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
    store.onRowReorder?.(selectedRowIndexes, store.rows.length - 1);

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
    store.onRowReorder?.(selectedRowIndexes, 0);

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
  store.onRowReorder?.(selectedRowIndexes, destinationRowIdx);

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
