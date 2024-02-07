import { Behavior } from "../types/Behavior";
import { Position } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint";
import { getCellContainerLocation } from "../utils/getCellContainerLocation";
import { handleKeyDown } from "../utils/handleKeyDown";
import isDevEnvironment from "../utils/isDevEnvironment";

const devEnvironment = isDevEnvironment();

type DefaultBehaviorConfig = {
  moveHorizontallyOnEnter: boolean;
};

const CONFIG_DEFAULTS: DefaultBehaviorConfig = {
  moveHorizontallyOnEnter: false,
} as const;

let touchStartPosition: Position | null = null;
let touchEndPosition: Position | null = null;

// TODO: Remove all non-(Pointer/Mouse/Touch)Down handlers to other behaviors (not DefaultBehavior!)
// TODO: handle everything on Pointer BUT check pointerType (mouse/touch)!!!

export const DefaultBehavior = (config: DefaultBehaviorConfig = CONFIG_DEFAULTS): Behavior => ({
  id: "Default",
  handlePointerDown: function (event, store): ReactGridStore {
    devEnvironment && console.log("DB/handlePointerDown");

    const element = getCellContainerFromPoint(event.clientX, event.clientY);
    let newRowIndex = -1;
    let newColIndex = -1;
    if (element) {
      const { rowIndex, colIndex } = getCellContainerLocation(element);
      newRowIndex = rowIndex;
      newColIndex = colIndex;
    }

    const SelectionBehavior = store.getBehavior("CellSelection");

    return {
      ...store,
      focusedLocation: { rowIndex: newRowIndex, colIndex: newColIndex },
      selectedArea: { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 },
      currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
      currentBehavior: SelectionBehavior || store.currentBehavior,
    };
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("DB/handlePointerMove");

    return store;
  },

  handlePointerUp: function (event, store) {
    return store;
  },

  handleKeyDown: function (event, store) {
    return handleKeyDown(event, store, { moveHorizontallyOnEnter: config.moveHorizontallyOnEnter });
  },

  handlePointerDownTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerDownTouch");

    const { clientX, clientY } = event;

    touchStartPosition = { x: clientX, y: clientY };

    // Disable moving (horizontal & vertical scrolling) if touchStartPosition is the same as focusedCell position.
    const focusedCell = store.getFocusedCell();
    const element = getCellContainerFromPoint(touchStartPosition.x, touchStartPosition.y);
    if (focusedCell && element) {
      const { rowIndex: touchRowIndex, colIndex: touchColIndex } = getCellContainerLocation(element);

      const focusedCellWasTouched = touchRowIndex === focusedCell.rowIndex && touchColIndex === focusedCell.colIndex;

      if (focusedCellWasTouched) {
        const SelectionBehavior = store.getBehavior("CellSelection");

        return {
          ...store,
          currentBehavior: SelectionBehavior,
        };
      }
    }

    return store;
  },

  handlePointerMoveTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerMoveTouch");

    return store;
  },

  handlePointerUpTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerUpTouch");

    const { clientX, clientY } = event;

    touchEndPosition = { x: clientX, y: clientY };

    if (touchStartPosition && touchEndPosition) {
      const prevElement = getCellContainerFromPoint(touchStartPosition.x, touchStartPosition.y);
      const currElement = getCellContainerFromPoint(touchEndPosition.x, touchEndPosition.y);
      if (prevElement && currElement) {
        const prevCell = getCellContainerLocation(prevElement);
        const currCell = getCellContainerLocation(currElement);

        if (prevCell.rowIndex === currCell.rowIndex && prevCell.colIndex === currCell.colIndex) {
          return {
            ...store,
            focusedLocation: { rowIndex: currCell.rowIndex, colIndex: currCell.colIndex },
            selectedArea: { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 },
            currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
          };
        }
      }
    }

    return store;
  },
});
