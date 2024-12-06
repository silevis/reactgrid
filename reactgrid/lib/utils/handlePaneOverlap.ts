import { ReactGridStore } from "../types/ReactGridStore";
import { getCellPaneOverlap } from "./getCellPaneOverlap";
import { getValueFromPixelString } from "./getValueFromPixelString";
import { getTheme } from "./getTheme";

export const handlePaneOverlap = (
  store: ReactGridStore,
  rowIndex: number,
  colIndex: number,
  scrollableParent: Element
) => {
  const themeStyles = getTheme(store);

  const gapWidth = getValueFromPixelString(themeStyles.gap.width || 0);

  const bottomCenterOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "BottomCenter");
  const topCenterPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "TopCenter");
  const leftPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Left");
  const rightPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Right");

  if (topCenterPaneOverlapValue) {
    scrollableParent?.scrollBy({
      top: -topCenterPaneOverlapValue - gapWidth,
    });
  }

  if (rightPaneOverlapValue) {
    scrollableParent?.scrollBy({
      left: rightPaneOverlapValue + gapWidth,
    });
  }

  if (bottomCenterOverlapValue) {
    scrollableParent?.scrollBy({
      top: bottomCenterOverlapValue + gapWidth,
    });
  }

  if (leftPaneOverlapValue) {
    scrollableParent?.scrollBy({
      left: -leftPaneOverlapValue - gapWidth,
    });
  }
};
