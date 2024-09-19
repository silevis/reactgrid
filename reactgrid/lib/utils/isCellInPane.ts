import { PaneName, SpanMember } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { isCellInRange } from "./isCellInRange";
import { isSpanMember } from "./isSpanMember";

export const isCellInPane = (store: ReactGridStore, cell: Cell | SpanMember, panePosition: PaneName) => {
  if (isSpanMember(cell)) {
    return isCellInRange(
      store,
      store.cells.get(`${cell.originRowIndex} ${cell.originColIndex}`),
      store.paneRanges[panePosition]
    );
  }

  return isCellInRange(store, cell, store.paneRanges[panePosition]);
};
