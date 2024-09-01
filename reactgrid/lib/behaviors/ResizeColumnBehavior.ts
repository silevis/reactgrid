import { Behavior } from "../types/Behavior.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { getNumberFromPixelString } from "../utils/getNumberFromPixelValueString.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";

const devEnvironment = isDevEnvironment();

let headerLeftPosition = 0;
let initialPointerX = 0;
let initialHeaderWidth = 0;

export const ResizeColumnBehavior: Behavior = {
  id: "ResizeColumn",
  handlePointerDown: function (event, store) {
    devEnvironment && console.log("RCB/handlePointerDown");

    return handlePointerDown(event, store);
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("RCB/handlePointerMove");

    return handlePointerMove(event, store);
  },

  handlePointerUp: function (event, store) {
    devEnvironment && console.log("RCB/handlePointerUp");

    return handlePointerUp(event, store);
  },

  handlePointerHold: function (event, store) {
    devEnvironment && console.log("RCB/handlePointerHold");
    return store;
  },

  handlePointerHoldTouch: function (event, store) {
    devEnvironment && console.log("RCB/handlePointerHoldTouch");
    return store;
  },

  handlePointerDownTouch: function (event, store) {
    devEnvironment && console.log("RCB/handlePointerDownTouch");

    return handlePointerDown(event, store);
  },

  handlePointerMoveTouch: function (event, store) {
    devEnvironment && console.log("RCB/handlePointerMoveTouch");

    return handlePointerMove(event, store);
  },

  handlePointerUpTouch: function (event, store) {
    devEnvironment && console.log("RCB/handlePointerUpTouch");

    return handlePointerUp(event, store);
  },
};

const handlePointerDown = (
  event: React.PointerEvent<HTMLDivElement> | PointerEvent,
  store: ReactGridStore
): Partial<ReactGridStore> => {
  const targetElement = event.target as HTMLDivElement;
  const headerContainer = targetElement.parentNode as HTMLDivElement;
  const headerContainerInitialWidth = headerContainer.offsetWidth;

  // get the left position relative to the viewport
  headerLeftPosition = headerContainer.offsetLeft;

  initialHeaderWidth = headerContainerInitialWidth;
  initialPointerX = event.clientX;

  return {
    ...store,
    lineOrientation: "vertical",
    linePosition: headerContainer.offsetLeft + headerContainer.offsetWidth,
  };
};

const handlePointerMove = (
  event: React.PointerEvent<HTMLDivElement> | PointerEvent,
  store: ReactGridStore
): Partial<ReactGridStore> => {
  const reactGridRef = store.reactGridRef;

  if (!reactGridRef) return store;

  const rect = reactGridRef.getBoundingClientRect();

  // get the left position relative to the viewport
  const gridContainerLeftPosition = rect.left;

  const linePosition = event.clientX - gridContainerLeftPosition;

  const headerCell = store.getCellByIndexes(0, store.resizingColIdx ?? 0)!;

  // get the column indexes that should be resized based on the cell's colSpan
  const colIndexesToResize = headerCell.colSpan
    ? Array.from({ length: headerCell.colSpan }, (_, i) => i + headerCell.colIndex)
    : [headerCell.colIndex];

  // calculate the minimum width for all columns in colSpan
  const minColumnWidth = colIndexesToResize.reduce((acc, colIdx) => {
    const column = store.getColumnByIdx(colIdx);
    return acc + getNumberFromPixelString(column?.minWidth ?? 0);
  }, 0);

  return {
    ...store,
    linePosition:
      linePosition > headerLeftPosition + minColumnWidth ? linePosition : headerLeftPosition + minColumnWidth,
  };
};

const handlePointerUp = (
  event: React.PointerEvent<HTMLDivElement> | PointerEvent,
  store: ReactGridStore
): Partial<ReactGridStore> => {
  // calculate the change in x-position
  const deltaX = event.clientX - initialPointerX;

  if (store.resizingColIdx === undefined) return store;
  // calculate the new width of the header
  const resultWidth = initialHeaderWidth + deltaX;

  const reactGridRef = store.reactGridRef;

  if (!reactGridRef) return store;

  const resizingColumn = store.getColumnByIdx(store.resizingColIdx);

  const minColumnWidth = getNumberFromPixelString(resizingColumn?.minWidth ?? 0);

  const rect = reactGridRef.getBoundingClientRect();

  // get the left position relative to the viewport
  const reactGridLeftPosition = rect.left;

  const linePosition = event.clientX - reactGridLeftPosition;

  const headerCell = store.getCellByIndexes(0, store.resizingColIdx)!;

  // get the column indexes that should be resized based on the cell's colSpan
  const colIndexesToResize = headerCell.colSpan
    ? Array.from({ length: headerCell.colSpan }, (_, i) => i + headerCell.colIndex)
    : [headerCell.colIndex];

  if (linePosition <= headerLeftPosition + minColumnWidth) {
    store.onResizeColumn?.(minColumnWidth, colIndexesToResize);
  } else {
    store.onResizeColumn?.(resultWidth, colIndexesToResize);
  }

  headerLeftPosition = 0;
  initialPointerX = 0;
  initialHeaderWidth = 0;

  return {
    ...store,
    linePosition: undefined,
    currentBehavior: store.getBehavior("Default"),
    resizingColIdx: undefined,
  };
};
