import { PaneName } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { isCellInRange } from "./isCellInRange";

export const isCellInPane = (store: ReactGridStore, cell: Cell, panePosition: PaneName) => {
  return isCellInRange(store, cell, store.paneRanges[panePosition]);
};
