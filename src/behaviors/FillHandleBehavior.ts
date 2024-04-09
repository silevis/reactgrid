import { Behavior } from "../types/Behavior";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "../utils/getCellArea";
import { getFillDirection } from "../utils/getFillDirection";

export const FillHandleBehavior: Behavior = {
  id: "FillHandle",
  handlePointerDown: function (event, store): ReactGridStore {
    return store;
  },
  handlePointerMove: function (event, store): ReactGridStore {
    const fillDirection = getFillDirection(store, event);
    const focusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

    if (!focusedCell) return store;

    const focusedCellArea = getCellArea(store, focusedCell);

    if (!fillDirection || !fillDirection.value) return store;

    switch (fillDirection?.direction) {
      case "up": {
        return {
          ...store,
          fillHandleArea: {
            startColIdx: focusedCellArea.startColIdx,
            startRowIdx: fillDirection.value,
            endColIdx: focusedCellArea.endColIdx,
            endRowIdx: focusedCellArea.startRowIdx,
          },
        };
      }
      case "right": {
        return {
          ...store,
          fillHandleArea: {
            startColIdx: focusedCellArea.endColIdx,
            startRowIdx: focusedCellArea.startRowIdx,
            endColIdx: fillDirection.value + 1,
            endRowIdx: focusedCellArea.endRowIdx,
          },
        };
      }
      case "down": {
        return {
          ...store,
          fillHandleArea: {
            startColIdx: focusedCellArea.startColIdx,
            startRowIdx: focusedCellArea.endRowIdx,
            endColIdx: focusedCellArea.endColIdx,
            endRowIdx: fillDirection.value + 1,
          },
        };
      }
      case "left": {
        return {
          ...store,
          fillHandleArea: {
            startColIdx: fillDirection.value,
            startRowIdx: focusedCellArea.startRowIdx,
            endColIdx: focusedCellArea.startColIdx,
            endRowIdx: focusedCellArea.endRowIdx,
          },
        };
      }
    }

    return store;
  },
  handlePointerUp: function (event, store): ReactGridStore {
    return {
      ...store,
      currentBehavior: store.getBehavior("Default"),
    };
  },
  handlePointerHold: function (event, store): ReactGridStore {
    return store;
  },
  handlePointerHoldTouch: function (event, store): ReactGridStore {
    return store;
  },
  handleKeyDown: function (event, store): ReactGridStore {
    return store;
  },
  handlePointerDownTouch: function (event, store): ReactGridStore {
    return store;
  },
  handlePointerMoveTouch: function (event, store): ReactGridStore {
    return store;
  },
  handlePointerUpTouch: function (event, store): ReactGridStore {
    return store;
  },
};
