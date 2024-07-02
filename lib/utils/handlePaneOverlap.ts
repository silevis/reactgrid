import { ReactGridStore } from "../types/ReactGridStore";
import { getCellPaneOverlap } from "./getCellPaneOverlap";

export const handlePaneOverlap = (
  store: ReactGridStore,
  rowIndex: number,
  colIndex: number,
  scrollableParent: Element
) => {
  const topPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Top");
  const rightPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Right");
  const bottomOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Bottom");
  const leftPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Left");

  if (topPaneOverlapValue) {
    scrollableParent?.scrollBy({
      top: -topPaneOverlapValue,
    });
  }

  if (rightPaneOverlapValue) {
    scrollableParent?.scrollBy({
      left: rightPaneOverlapValue,
    });
  }

  if (bottomOverlapValue) {
    scrollableParent?.scrollBy({
      top: bottomOverlapValue,
    });
  }

  if (leftPaneOverlapValue) {
    scrollableParent?.scrollBy({
      left: -leftPaneOverlapValue,
    });
  }
};
