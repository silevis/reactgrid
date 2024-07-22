import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { getCellContainerFromPoint } from "./getCellContainerFromPoint";
import { getCellContainerLocation } from "./getCellContainerLocation";

export const getRowIdxByPointerLocation = (store: ReactGridStore, x: number, y: number): number => {
  const pointerCell = getCellContainerFromPoint(x, y);

  if (pointerCell) {
    const { rowIndex, colIndex } = getCellContainerLocation(pointerCell);
    const cell = store.getCellByIndexes(rowIndex, colIndex);

    if (!cell) return -1;

    const cellContainer = getCellContainer(store, cell);

    if (!cellContainer) return -1;

    if (cell && cell.rowSpan) {
      // Calculate the pointer's position relative to the cell's top edge
      const relativeY = y - cellContainer?.getBoundingClientRect?.().top;
      // Determine the height of a single span of the cell
      const singleSpanHeight = cellContainer.getBoundingClientRect?.().height / cell.rowSpan;
      // Adjust the row index based on the relative position of the pointer
      const additionalRowSpans = Math.floor(relativeY / singleSpanHeight);
      return rowIndex + additionalRowSpans;
    }

    return rowIndex;
  }

  return -1;
};
