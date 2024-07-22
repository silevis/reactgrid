import { Cell, SpanMember } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { isSpanMember } from "./isSpanMember.ts";

export const getOriginCell = (store: ReactGridStore, cell: Cell | SpanMember): Cell => {
  if (isSpanMember(cell)) {
    return store.getCellByIds(cell.originRowId, cell.originColId) as Cell;
  }

  return cell;
};
