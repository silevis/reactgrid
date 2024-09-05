import { Cell, SpanMember, NumericalRange } from "../types/PublicModel.ts";
import { isCellSpanned } from "./isCellSpanned.ts";
import { getOriginCell } from "./getOriginCell.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { EMPTY_AREA } from "../types/InternalModel.ts";

export const getCellArea = (store: ReactGridStore, cell: Cell | SpanMember): NumericalRange => {
  if (!cell) return EMPTY_AREA;

  const originCell = getOriginCell(store, cell);
  if (isCellSpanned(originCell)) {
    return {
      startRowIdx: originCell.rowIndex,
      endRowIdx: originCell.rowIndex + (originCell?.rowSpan ?? 1),
      startColIdx: originCell.colIndex,
      endColIdx: originCell.colIndex + (originCell?.colSpan ?? 1),
    };
  }

  return {
    startRowIdx: originCell.rowIndex,
    endRowIdx: originCell.rowIndex + 1,
    startColIdx: originCell.colIndex,
    endColIdx: originCell.colIndex + 1,
  };
};
