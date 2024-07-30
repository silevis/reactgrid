import { ReactGridStore } from "../types/ReactGridStore";
import { getCellPaneOverlap } from "./getCellPaneOverlap";

export const handlePaneOverlap = (
  store: ReactGridStore,
  rowIndex: number,
  colIndex: number,
  scrollableParent: Element
) => {
  const bottomCenterOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "BottomCenter");
  const topCenterPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "TopCenter");
  const leftPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Left");
  const rightPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Right");

  if (topCenterPaneOverlapValue) {
    scrollableParent?.scrollBy({
      top: -topCenterPaneOverlapValue,
    });
  }

  if (rightPaneOverlapValue) {
    scrollableParent?.scrollBy({
      left: rightPaneOverlapValue,
    });
  }

  if (bottomCenterOverlapValue) {
    scrollableParent?.scrollBy({
      top: bottomCenterOverlapValue,
    });
  }

  if (leftPaneOverlapValue) {
    scrollableParent?.scrollBy({
      left: -leftPaneOverlapValue,
    });
  }
};
