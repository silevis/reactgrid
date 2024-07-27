import { PaneName } from "../types/InternalModel";
import { ReactGridStore } from "../types/ReactGridStore";

export const isPaneExists = (store: ReactGridStore, panePosition: PaneName) => {
  const paneRanges = store.paneRanges;

  switch (panePosition) {
    case "TopLeft":
      return paneRanges.TopLeft.endRowIdx > 0;
    case "TopCenter":
      return paneRanges.TopCenter.endRowIdx > 0;
    case "TopRight":
      return paneRanges.TopCenter.endRowIdx > 0;
    case "Left":
      return paneRanges.Left.endColIdx > 0;
    case "Right":
      return paneRanges.Right.startColIdx < store.columns.length;
    case "BottomLeft":
      return paneRanges.BottomLeft.startRowIdx < store.rows.length;
    case "BottomCenter":
      return paneRanges.BottomCenter.startRowIdx < store.rows.length;
    case "BottomRight":
      return paneRanges.BottomCenter.startRowIdx < store.rows.length;
    default:
      return false;
  }
};
