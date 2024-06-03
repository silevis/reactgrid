import { Behavior } from "../types/Behavior.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";

const devEnvironment = isDevEnvironment();

let headerLeftPosition = 0;
let initialPointerX = 0;
let initialHeaderWidth = 0;

export const ResizeColumnBehavior: Behavior = {
  id: "ResizeColumn",
  handlePointerDown: function (event, store): ReactGridStore {
    devEnvironment && console.log("CRB/handlePointerDown");

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
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("CRB/handlePointerMove");

    const reactGridRef = store.reactGridRef;

    if (!reactGridRef) return store;

    const rect = reactGridRef.getBoundingClientRect();

    // get the left position relative to the viewport
    const gridContainerLeftPosition = rect.left;

    const linePosition = event.clientX - gridContainerLeftPosition;

    return {
      ...store,
      linePosition:
        linePosition > headerLeftPosition + store.minColumnWidth
          ? linePosition
          : headerLeftPosition + store.minColumnWidth,
    };
  },

  handlePointerUp: function (event, store) {
    // calculate the change in x-position
    const deltaX = event.clientX - initialPointerX;

    // calculate the new width of the header
    const resultWidth = initialHeaderWidth + deltaX;

    const reactGridRef = store.reactGridRef;

    if (!reactGridRef) return store;

    const rect = reactGridRef.getBoundingClientRect();

    // get the left position relative to the viewport
    const reactGridLeftPosition = rect.left;

    const linePosition = event.clientX - reactGridLeftPosition;

    if (store.resizingColId) {
      if (linePosition <= headerLeftPosition + store.minColumnWidth) {
        store.onResizeColumn?.(store.minColumnWidth, store.resizingColId);
      } else {
        store.onResizeColumn?.(resultWidth, store.resizingColId);
      }
    }

    headerLeftPosition = 0;
    initialPointerX = 0;
    initialHeaderWidth = 0;

    return { ...store, linePosition: undefined, currentBehavior: store.getBehavior("Default") };
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

    return store;
  },

  handlePointerUpTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerUpTouch");

    return store;
  },
};
