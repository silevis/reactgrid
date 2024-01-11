import { IndexedLocation } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "./reactGridStore";

interface CellAndLocation extends IndexedLocation {
  cell?: Cell;
}

export const getLocationFromClient = (store: ReactGridStore, clientX: number, clientY: number): CellAndLocation => {
  if (!store.reactGridRef) {
    throw new Error('ReactGridRef is not assigned!');
  }

  const cellContainer = getContainerFromPoint(clientX, clientY);
  if (!cellContainer) return { cell: undefined, rowIndex: -1, colIndex: -1 };

  const rowIdxMatch = /rgRowIdx-(\d+)/.exec(cellContainer.classList.value);
  const colIdxMatch = /rgColIdx-(\d+)/.exec(cellContainer.classList.value);

  if (rowIdxMatch && colIdxMatch) {
    const rowIndex = parseInt(rowIdxMatch[1]);
    const colIndex = parseInt(colIdxMatch[1]);

    const cell = store.getCellByIndexes(rowIndex, colIndex);
    if (!cell) {
      return {
        cell: undefined,
        rowIndex: -1,
        colIndex: -1,
      };
    }

    return {
      cell,
      rowIndex,
      colIndex
    };
  } else {
    return {
      cell: undefined,
      rowIndex: -1,
      colIndex: -1,
    };
  }

};

export const getContainerFromPoint = (x: number, y: number): HTMLElement | null => {
  const element = document.elementFromPoint(x, y) as HTMLElement;

  if (element && element.classList.contains("rgCellContainer")) {
    return element;
  } else if (element?.closest(".rgCellContainer")) {
    return element?.closest(".rgCellContainer");
  }

  return null;
};