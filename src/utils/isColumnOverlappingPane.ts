import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { getElementsOverlapValues } from "./getElementsOverlapValues";
import { isTheSameCell } from "./isTheSameCell";

export const isColumnOverlappingPane = (store: ReactGridStore, columnIdx: number, panePosition: "left" | "right") => {
  const headerCell = store.getCellByIndexes(0, columnIdx);
  const paneCell =
    panePosition === "left"
      ? store.getCellByIndexes(0, store.paneRanges.Left.endColIdx - 1)
      : store.getCellByIndexes(0, store.paneRanges.Right.startColIdx);

  if (!paneCell || !headerCell) return false;

  const paneContainer = getCellContainer(store, paneCell) as HTMLElement | null;
  const headerContainer = getCellContainer(store, headerCell) as HTMLElement | null;

  if (!paneContainer || !headerContainer) return false;

  if (isTheSameCell(paneContainer, headerContainer)) {
    return false;
  }

  const isOverlapping = getElementsOverlapValues(paneContainer, headerContainer);

  return isOverlapping.overlapX ? true : false;
};
