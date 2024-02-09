import { NumericalRange } from "../types/CellMatrix";
import { Cell, SpanMember } from "../types/PublicModel";
import { isCellSpanned } from "./isCellSpanned";
import { getOriginCell } from "./getOriginCell";
import { ReactGridStore } from "../types/ReactGridStore.ts";

export const getCellArea = (store: ReactGridStore, cell: Cell | SpanMember): NumericalRange => {
  const originCell = getOriginCell(store, cell);
  const rowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
  const colIndex = store.columns.findIndex((col) => col.id === originCell.colId);

  if (isCellSpanned(originCell)) {
    return {
      startRowIdx: rowIndex,
      endRowIdx: rowIndex + (originCell?.rowSpan ?? 1),
      startColIdx: colIndex,
      endColIdx: colIndex + (originCell?.colSpan ?? 1)
    };
  }

  return {
    startRowIdx: rowIndex,
    endRowIdx: rowIndex + 1,
    startColIdx: colIndex,
    endColIdx: colIndex + 1
  };
};
