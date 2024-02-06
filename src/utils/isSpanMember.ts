import { Cell, SpanMember } from "../types/PublicModel";

export const isSpanMember = (cell: Cell | SpanMember): cell is SpanMember => {
  return "originRowId" in cell && "originColId" in cell;
};
