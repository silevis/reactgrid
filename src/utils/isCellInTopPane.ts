import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { isCellInRange } from "./isCellInRange";

export const isCellInTopPane = (store: ReactGridStore, cell: Cell) => {
  return (
    isCellInRange(store, cell, store.paneRanges.TopLeft) ||
    isCellInRange(store, cell, store.paneRanges.TopCenter) ||
    isCellInRange(store, cell, store.paneRanges.TopRight)
  );
};
