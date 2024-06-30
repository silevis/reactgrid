import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { getCellContainerFromPoint } from "./getCellContainerFromPoint";
import { getCellContainerLocation } from "./getCellContainerLocation";

export const getColumnIdxByPointerLocation = (store: ReactGridStore, x: number, y: number): number => {
  const pointerCell = getCellContainerFromPoint(x, y);

  if (pointerCell) {
    const { rowIndex, colIndex } = getCellContainerLocation(pointerCell);
    const cell = store.getCellByIndexes(rowIndex, colIndex);

    if (!cell) return -1;

    const cellContainer = getCellContainer(store, cell);

    if (!cellContainer) return -1;

    if (cell && cell.colSpan) {
      // Calculate the pointer's position relative to the cell's left edge
      const relativeX = x - cellContainer?.getBoundingClientRect?.().left;
      // Determine the width of a single span of the cell
      const singleSpanWidth = cellContainer.getBoundingClientRect?.().width / cell.colSpan;
      // Adjust the column index based on the relative position of the pointer
      const additionalColSpans = Math.floor(relativeX / singleSpanWidth);
      return colIndex + additionalColSpans;
    }

    return colIndex;
  }

  return -1;
};
