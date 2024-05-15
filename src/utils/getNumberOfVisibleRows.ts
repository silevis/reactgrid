import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { isCellInRange } from "./isCellInRange";
import { isInViewport } from "./isInViewport";

export const getNumberOfVisibleRows = (store: ReactGridStore, columnId?: string) => {
  const scrollableParent = store.reactGridRef!;

  let visibleCells = 0;

  if (!columnId) return 0;

  // Get all cells in the current column
  const cellsInCol = (Array.from(store.cells.values()) as Cell[]).filter((cell) => {
    return cell.colId === columnId;
  });

  // Find the last cell in the viewport
  for (const cell of cellsInCol) {
    const currentCellContainer = getCellContainer(store, cell) as HTMLElement;

    if (
      isInViewport(currentCellContainer, scrollableParent) &&
      (isCellInRange(store, cell, store.paneRanges.Left) ||
        isCellInRange(store, cell, store.paneRanges.Center) ||
        isCellInRange(store, cell, store.paneRanges.Right))
    ) {
      visibleCells++;
    }
  }

  return visibleCells;
};
