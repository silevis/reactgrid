import { Behavior } from "../types/Behavior";
import { IndexedLocation } from "../types/InternalModel";
import { handleKeyDown } from "../utils/handleKeyDown";
import { hasTouchSupport, isMobile } from "../utils/isMobile";
import { ReactGridStore } from "../utils/reactGridStore";

type DefaultBehaviorConfig = {
  moveHorizontallyOnEnter: boolean;
};

const CONFIG_DEFAULTS: DefaultBehaviorConfig = {
  moveHorizontallyOnEnter: false,
} as const;

const timer: ReturnType<typeof setTimeout> | null = null;
let pointerDownPosition: { x: number; y: number } | null = null;
let touchStartPosition: { x: number; y: number } | null = null;
let touchEndPosition: { x: number; y: number } | null = null;

const getElementFromPoint = (x: number, y: number): HTMLElement | null => {
  const element = document.elementFromPoint(x, y) as HTMLElement;
  if (element && element.classList.contains("rgCellContainer")) {
    return element;
  } else if (element?.closest(".rgCellContainer")) {
    return element?.closest(".rgCellContainer");
  }
  return null;
};

function getCellContainerLocation(element: HTMLElement): IndexedLocation {
  const rowIdxRegex = /rgRowIdx-(\d+)/;
  const colIdxRegex = /rgColIdx-(\d+)/;

  const rowIdxMatch = rowIdxRegex.exec(element.classList.value);
  const colIdxMatch = colIdxRegex.exec(element.classList.value);

  if (rowIdxMatch && colIdxMatch) {
    return {
      rowIndex: parseInt(rowIdxMatch[1]),
      colIndex: parseInt(colIdxMatch[1]),
    };
  } else {
    return {
      rowIndex: -1,
      colIndex: -1,
    };
  }
}
export const DefaultBehavior = (config: DefaultBehaviorConfig = CONFIG_DEFAULTS): Behavior => ({
  handlePointerDown: function (event, store): ReactGridStore {
    if (isMobile()) {
      return store;
    }
    console.log("DB/handlePointerDown");

    pointerDownPosition = { x: event.clientX, y: event.clientY };
    const element = getElementFromPoint(event.clientX, event.clientY);
    let newRowIndex = -1;
    let newColIndex = -1;
    if (element) {
      const { rowIndex, colIndex } = getCellContainerLocation(element);
      newRowIndex = rowIndex;
      newColIndex = colIndex;
    }

    return {
      ...store,
      focusedLocation: { rowIndex: newRowIndex, colIndex: newColIndex },
      selectedArea: { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 },
      currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
    };
  },

  handlePointerMove: (event, store) => {
    if (isMobile()) {
      return store;
    }
    console.log("DB/handlePointerMove");

    if (pointerDownPosition) {
      const distanceMoved = Math.sqrt(
        (event.clientX - pointerDownPosition.x) ** 2 + (event.clientY - pointerDownPosition.y) ** 2
      );

      if (distanceMoved > 10) {
        timer && clearTimeout(timer);
        pointerDownPosition = null;

        const SelectionBehavior = store.getBehavior("CellSelection");

        return {
          ...store,
          currentBehavior: SelectionBehavior,
        };
      }
    }

    return store;
  },

  handlePointerUp: function (event, store) {
    if (isMobile()) {
      return store;
    }

    if (timer) {
      clearTimeout(timer);
    }

    if (pointerDownPosition && event.clientX === pointerDownPosition.x && event.clientY === pointerDownPosition.y) {
      // TODO: Double tap
      console.log("Double tap");
    }

    pointerDownPosition = null;

    return store;
  },

  handleKeyDown: function (event, store) {
    return handleKeyDown(event, store);
  },

  handleTouchStart: function (event, store) {
    if (!hasTouchSupport()) {
      return store;
    }

    console.log("DB/handleTouchStart");

    const { clientX, clientY } = event.touches[0]; //  * This might be not a good idea to do it that way...
    touchStartPosition = { x: clientX, y: clientY };

    // Disable moving (horizontal & vertical scrolling) if touchStartPosition is the same as focusedCell position.
    const focusedCell = store.getFocusedCell();
    const element = getElementFromPoint(touchStartPosition.x, touchStartPosition.y);
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

  handleTouchMove: function (_event, store) {
    if (!hasTouchSupport()) {
      return store;
    }

    console.log("DB/handleTouchMove");

    return store;
  },

  handleTouchEnd: function (event, store) {
    if (!hasTouchSupport()) {
      return store;
    }

    console.log("DB/handleTouchEnd");

    if (timer) {
      clearTimeout(timer);
    }

    const { clientX, clientY } = event.changedTouches[0]; //  * This might be not a good idea to do it that way...

    touchEndPosition = { x: clientX, y: clientY };

    if (touchStartPosition && touchEndPosition) {
      const prevElement = getElementFromPoint(touchStartPosition.x, touchStartPosition.y);
      const currElement = getElementFromPoint(touchEndPosition.x, touchEndPosition.y);
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
