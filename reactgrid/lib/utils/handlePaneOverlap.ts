import { ReactGridStore } from "../types/ReactGridStore";
import { getCellPaneOverlap } from "./getCellPaneOverlap";
import { getNumberFromPixelString } from "./getNumberFromPixelValueString";
import { getTheme } from "./getTheme";

export const handlePaneOverlap = (
  store: ReactGridStore,
  rowIndex: number,
  colIndex: number,
  scrollableParent: Element
) => {
  const styles = getTheme(store);

  const gridGap = getNumberFromPixelString(styles.grid.gap.width || 0);

  const bottomCenterOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "BottomCenter");
  const topCenterPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "TopCenter");
  const leftPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Left");
  const rightPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Right");

  if (topCenterPaneOverlapValue) {
    scrollableParent?.scrollBy({
      top: -topCenterPaneOverlapValue - gridGap,
    });
  }

  if (rightPaneOverlapValue) {
    scrollableParent?.scrollBy({
      left: rightPaneOverlapValue + gridGap,
    });
  }

  if (bottomCenterOverlapValue) {
    scrollableParent?.scrollBy({
      top: bottomCenterOverlapValue + gridGap,
    });
  }

  if (leftPaneOverlapValue) {
    scrollableParent?.scrollBy({
      left: -leftPaneOverlapValue - gridGap,
    });
  }
};
