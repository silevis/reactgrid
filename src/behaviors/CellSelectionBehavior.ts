import { Behavior, BehaviorConstructor } from "../types/Behavior";
import { IndexedLocation } from "../types/InternalModel";
import { DefaultBehavior } from "./DefaultBehavior";

export const CellSelectionBehavior: BehaviorConstructor = (setCurrentBehavior) => {
  const getElementFromPoint = (x: number, y: number): HTMLElement | null => {
    const element = document.elementFromPoint(x, y) as HTMLElement;
    if (element && element.classList.contains("rgCellContainer")) {
      lastValidPointerLocation.x = x;
      lastValidPointerLocation.y = y;
      lastValidElement = element;
      return element;
    } else if (element?.closest(".rgCellContainer")) {
      lastValidPointerLocation.x = x;
      lastValidPointerLocation.y = y;
      lastValidElement = element?.closest(".rgCellContainer");
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
 
  const lastValidPointerLocation: { x: number, y: number } = { x: -1, y: -1 };
  let lastValidElement: HTMLElement | null = null;
  // const selectedArea: NumericalRange = getReactGridStoreApi(reactGridId).getState().selectedArea;

  const behavior: Behavior = {
    id: "CellSelection",
    
    handlePointerMove(event, store) {
      // window.addEventListener("pointermove", behavior.handlePointerMove);
      // window.addEventListener("pointerup", behavior.handlePointerUp);
      console.log("CSB/handlePointerMove");

      const element = getElementFromPoint(event.clientX, event.clientY);
      const selectedArea = store.selectedArea;
      const focusedLocation = store.focusedLocation;
      if (element) {
        const { rowIndex, colIndex } = getCellContainerLocation(element);
        const cell = store.getCellByIndexes(rowIndex, colIndex);

        if (rowIndex < focusedLocation.rowIndex) {
          selectedArea.endRowIdx = focusedLocation.rowIndex + 1;
          selectedArea.startRowIdx = rowIndex;
        } else {
          selectedArea.endRowIdx = rowIndex + (cell?.rowSpan || 1);
          selectedArea.startRowIdx = focusedLocation.rowIndex;
        }

        if (colIndex < focusedLocation.colIndex) {
          selectedArea.endColIdx = focusedLocation.colIndex + 1;
          selectedArea.startColIdx = colIndex;
        } else {
          selectedArea.endColIdx = colIndex + (cell?.colSpan || 1);
          selectedArea.startColIdx = focusedLocation.colIndex;
        }

        return {
          ...store,
          selectedArea: {
            ...selectedArea,
          },
        }
      }

      return store;
    },

    handlePointerUp(event, store) {
      setCurrentBehavior(DefaultBehavior(setCurrentBehavior));

      return store;
    },
  }

  return behavior;
}