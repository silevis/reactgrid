import { Behavior } from "../types/Behavior.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";

const devEnvironment = isDevEnvironment();

export const ColumnReorderBehavior: Behavior = {
  id: "ColumnReorder",
  handlePointerDown: function (event, store): ReactGridStore {
    devEnvironment && console.log("CRB/handlePointerDown");

    const selectedArea = store.selectedArea;
    const columns = store.columns;

    return { ...store, lineOrientation: "vertical", shadowSize: undefined };
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
