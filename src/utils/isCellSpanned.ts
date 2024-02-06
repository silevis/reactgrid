import { Cell, SpanMember } from "../types/PublicModel";
import { SpannedCell } from "../types/InternalModel";

export const isCellSpanned = (cell: Cell | SpanMember): cell is SpannedCell => {
  return "rowSpan" in cell || "colSpan" in cell;
};
