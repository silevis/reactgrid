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

const devEnvironment = isDevEnvironment();

let initialMouseYPos = 0;
let mouseToCellTopBorderDistanceY = 0;
let destinationRowIdx = 0;

export const RowReorderBehavior: Behavior = {
  id: "RowReorder",
  handlePointerDown: function (event, store): ReactGridStore {
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
): ReactGridStore => {
  devEnvironment && console.log("RRB/handlePointerMove");

  if (!initialMouseYPos) {
    initialMouseYPos = event.clientY;
  }

  const firstColumnCell = store.getCellByIndexes(0, 0);

  if (!firstColumnCell) return store;

  const firstColumnCellContainer = getCellContainer(store, firstColumnCell) as HTMLElement | undefined;

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

  const cellContainer = getCellContainer(store, firstCellInSelectedArea) as HTMLElement | undefined;

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

  const cell = getCellIndexesFromContainerElement(element);

  if (!cell) return store;

  // In case a row can have spanned cells, it's necessary to find the minimal selected area
  const minimalSelection = findMinimalSelectedArea(store, {
    startRowIdx: cell.rowIndex,
    endRowIdx: cell.rowIndex + 1,
    startColIdx: 0,
    endColIdx: store.columns.length,
  });

  const topCell = store.getCellByIndexes(minimalSelection.startRowIdx, minimalSelection.startColIdx);
  const bottomCell = store.getCellByIndexes(minimalSelection.endRowIdx - 1, minimalSelection.startColIdx);

  if (!topCell || !bottomCell) return store;

  const topCellContainer = getCellContainer(store, topCell) as HTMLElement | null;
  const bottomCellContainer = getCellContainer(store, bottomCell) as HTMLElement | null;

  if (!topCellContainer || !bottomCellContainer) return store;

  let linePosition = undefined;

  // Determine the destination row index based on the cursor position and line position
  // Case 1 - Cursor is moving below the selected rows
  if (event.clientY > cellContainer.getBoundingClientRect().top + selectedAreaHeight) {
    destinationRowIdx = minimalSelection.endRowIdx - 1;

    if (getCellPaneOverlap(store, { rowIndex: destinationRowIdx, colIndex: 0 }, "Bottom")) {
      linePosition = undefined;
    } else {
      linePosition = bottomCellContainer.offsetTop + bottomCellContainer.offsetHeight;
    }
  } else if (event.clientY < cellContainer.getBoundingClientRect().top - 1) {
    // Case 2 - Cursor is moving above the selected rows
    destinationRowIdx = minimalSelection.startRowIdx;

    if (getCellPaneOverlap(store, { rowIndex: destinationRowIdx, colIndex: 0 }, "Top")) {
      linePosition = undefined;
    } else {
      linePosition = topCellContainer.offsetTop;
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
): ReactGridStore => {
  mouseToCellTopBorderDistanceY = 0;
  // Prevent triggering the resize behavior when a row is selected twice without moving the pointer
  if (!initialMouseYPos) return { ...store, currentBehavior: store.getBehavior("Default") };
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

  let newFocusedLocation;

  if (isFocusedCellInSelectedArea) {
    const offset = store.focusedLocation.rowIndex - store.selectedArea.startRowIdx;
    newFocusedLocation = {
      rowIndex: isUpDirection
        ? destinationRowIdx + offset
        : destinationRowIdx - (selectedRowIndexes.length - 1) + offset,
      colIndex: store.focusedLocation.colIndex,
    };
  }

  const { lastRowHeight, lastRowClientOffsetTop } = getLastRowMetrics(store);

  // CASE 1
  // If the mouse pointer is beyond the last row, move the selected rows to the last row
  if (event.clientY > lastRowClientOffsetTop + lastRowHeight) {
    store.onRowReorder?.(selectedRowIndexes, store.rows.length - 1);
    return {
      ...store,
      currentBehavior: store.getBehavior("Default"),
      ...(newFocusedLocation && { focusedLocation: newFocusedLocation }),
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
      ...store,
      currentBehavior: store.getBehavior("Default"),
      ...(newFocusedLocation && { focusedLocation: newFocusedLocation }),
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
    ...store,
    currentBehavior: store.getBehavior("Default"),
    ...(newFocusedLocation && { focusedLocation: newFocusedLocation }),
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
