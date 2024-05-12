import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { isCellInRange } from "./isCellInRange";

export const isCellInBottomPane = (store: ReactGridStore, cell: Cell) => {
  return (
    isCellInRange(store, cell, store.paneRanges.BottomLeft) ||
    isCellInRange(store, cell, store.paneRanges.BottomCenter) ||
    isCellInRange(store, cell, store.paneRanges.BottomRight)
  );
};
