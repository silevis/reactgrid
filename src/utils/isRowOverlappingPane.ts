import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { getElementsOverlapValues } from "./getElementsOverlapValues";
import { isTheSameCell } from "./isTheSameCell";

export const isRowOverlappingPane = (store: ReactGridStore, rowIndex: number, panePosition: "top" | "bottom") => {
  const firstCellInRow = store.getCellByIndexes(rowIndex, 0);
  const paneCell =
    panePosition === "top"
      ? store.getCellByIndexes(store.paneRanges.TopLeft.endRowIdx - 1, 0)
      : store.getCellByIndexes(store.paneRanges.BottomLeft.startRowIdx, 0);

  if (!paneCell || !firstCellInRow) return false;

  const paneContainer = getCellContainer(store, paneCell) as HTMLElement | null;
  const rowContainer = getCellContainer(store, firstCellInRow) as HTMLElement | null;

  if (!paneContainer || !rowContainer) return false;

  if (isTheSameCell(paneContainer, rowContainer)) {
    return false;
  }

  const isOverlapping = getElementsOverlapValues(paneContainer, rowContainer);

  return isOverlapping.overlapY ? true : false;
};
