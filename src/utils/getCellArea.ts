import { NumericalRange } from "../types/CellMatrix";
import { Cell } from "../types/PublicModel";
import { isCellSpanned } from "./isCellSpanned";

export const getCellArea = (cell: Cell): NumericalRange => {
  if (isCellSpanned(cell)) {
    return {
      startRowIdx: +cell?.rowId,
      endRowIdx: +cell?.rowId + (cell?.rowSpan ?? 1),
      startColIdx: +cell?.colId,
      endColIdx: +cell?.colId + (cell?.colSpan ?? 1),
    };
  }

  return {
    startRowIdx: +cell?.rowId,
    endRowIdx: +cell?.rowId + 1,
    startColIdx: +cell?.colId,
    endColIdx: +cell?.colId + 1,
  };
};
