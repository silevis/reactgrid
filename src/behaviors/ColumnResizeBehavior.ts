import { Behavior } from "../types/Behavior";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import isDevEnvironment from "../utils/isDevEnvironment";

const devEnvironment = isDevEnvironment();

export const ColumnResizeBehavior: Behavior = {
  id: "ColumnResize",
  handlePointerDown: function (event, store): ReactGridStore {
    devEnvironment && console.log("CRB/handlePointerDown");

    return store;
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("CRB/handlePointerMove");

    return store;
  },

  handlePointerUp: function (event, store) {
    return store;
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
