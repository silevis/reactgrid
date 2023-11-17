import { BehaviorConstructor } from "../types/Behavior";
import { IndexedLocation } from "../types/InternalModel";
import { ReactGridStore } from "../utils/reactGridStore";
import { CellSelectionBehavior } from "./CellSelectionBehavior";

export const DefaultBehavior: BehaviorConstructor = (setCurrentBehavior) => {
  const timer: ReturnType<typeof setTimeout> | null = null;
  let pointerDownPosition: { x: number; y: number } | null = null;

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

  return {
    id: "Default",

    handlePointerDown: function (event, store): ReactGridStore {
      pointerDownPosition = { x: event.clientX, y: event.clientY };
      const element = getElementFromPoint(event.clientX, event.clientY);
      let newRowIndex = -1;
      let newColIndex = -1;
      if (element) {
        const { rowIndex, colIndex } = getCellContainerLocation(element);
        newRowIndex = rowIndex;
        newColIndex = colIndex;
        // store.setSelectedArea({ startRowIdx: newRowIndex, endRowIdx: newRowIndex + 1, startColIdx: newColIndex, endColIdx: newColIndex + 1 });
      }

      // timer = setTimeout(() => {
      //   if (pointerDownPosition) {
      //     // TODO: onSelectionCanceled();
      //     // Not really, it can be reactivated anyway even if this condition is true
      //     console.log("onSelectionCanceled");
      //   }
      // }, 500);

      return {
        ...store,
        focusedLocation: { rowIndex: newRowIndex, colIndex: newColIndex },
        selectedArea: {
          startRowIdx: newRowIndex,
          endRowIdx: newRowIndex + 1,
          startColIdx: newColIndex,
          endColIdx: newColIndex + 1,
        },
      };
    },
    handlePointerMove: (event, store) => {
      console.log("DB/handlePointerMove");

      if (pointerDownPosition) {
        const distanceMoved = Math.sqrt(
          (event.clientX - pointerDownPosition.x) ** 2 + (event.clientY - pointerDownPosition.y) ** 2
        );

        if (distanceMoved > 10) {
          timer && clearTimeout(timer);
          // TODO: onSelectionActivated();
          const selectionBehavior = CellSelectionBehavior(setCurrentBehavior);

          setCurrentBehavior(selectionBehavior);
        }
      }

      return store;
    },
    handlePointerUp: function (event, store) {
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
  };
};
