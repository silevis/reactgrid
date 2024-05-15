import { Behavior } from "../types/Behavior.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";

const devEnvironment = isDevEnvironment();

let initialPointerX = 0;
let initialHeaderWidth = 0;

export const ResizeColumnBehavior: Behavior = {
  id: "ResizeColumn",
  handlePointerDown: function (event, store): ReactGridStore {
    devEnvironment && console.log("CRB/handlePointerDown");

    const targetElement = event.target as HTMLDivElement;
    const headerContainer = targetElement.parentNode as HTMLDivElement;
    const headerContainerInitialWidth = headerContainer.offsetWidth;

    initialHeaderWidth = headerContainerInitialWidth;
    initialPointerX = event.clientX;

    return { ...store, lineOrientation: "vertical", linePosition: event.clientX };
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("CRB/handlePointerMove");

    return { ...store, linePosition: event.clientX };
  },

  handlePointerUp: function (event, store) {
    // calculate the change in x-position
    const deltaX = event.clientX - initialPointerX;

    // calculate the new width of the header
    const resultWidth = initialHeaderWidth + deltaX;

    if (resultWidth > 0) {
      store.onResizeColumn?.(resultWidth, store.resizingColId!);
    }

    initialPointerX = 0;
    initialHeaderWidth = 0;

    return { ...store, currentBehavior: store.getBehavior("Default"), lineOrientation: undefined };
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
