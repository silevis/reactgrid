import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { isCellInRange } from "./isCellInRange";

export const isCellInPane = (store: ReactGridStore, cell: Cell, panePosition: "Top" | "Bottom" | "Right" | "Left") => {
  if (panePosition === "Left") {
    return (
      isCellInRange(store, cell, store.paneRanges.TopLeft) ||
      isCellInRange(store, cell, store.paneRanges.Left) ||
      isCellInRange(store, cell, store.paneRanges.BottomLeft)
    );
  }
  if (panePosition === "Right") {
    return (
      isCellInRange(store, cell, store.paneRanges.TopRight) ||
      isCellInRange(store, cell, store.paneRanges.Right) ||
      isCellInRange(store, cell, store.paneRanges.BottomRight)
    );
  }
  if (panePosition === "Top") {
    return (
      isCellInRange(store, cell, store.paneRanges.TopLeft) ||
      isCellInRange(store, cell, store.paneRanges.TopCenter) ||
      isCellInRange(store, cell, store.paneRanges.TopRight)
    );
  }
  if (panePosition === "Bottom") {
    return (
      isCellInRange(store, cell, store.paneRanges.BottomLeft) ||
      isCellInRange(store, cell, store.paneRanges.BottomCenter) ||
      isCellInRange(store, cell, store.paneRanges.BottomRight)
    );
  }
};
