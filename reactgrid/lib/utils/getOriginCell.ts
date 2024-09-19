import { SpanMember } from "../types/InternalModel.ts";
import { Cell } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { isSpanMember } from "./isSpanMember.ts";

export const getOriginCell = (store: ReactGridStore, cell: Cell | SpanMember): Cell => {
  if (isSpanMember(cell)) {
    return store.getCellByIndexes(cell.originRowIndex, cell.originColIndex) as Cell;
  }

  return cell;
};
