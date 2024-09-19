import { SpanMember } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";

export const isSpanMember = (cell: Cell | SpanMember): cell is SpanMember => {
  if (!cell) return false;

  return "originRowIndex" in cell && "originColIndex" in cell;
};
