import { NumericalRange } from "../types/CellMatrix";
import { Range } from "../types/PublicModel";
import { EMPTY_AREA } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";

export function getNumericalRange(store: ReactGridStore, range: Range): NumericalRange {
  const { start, end } = range;

  const startCell = store.getCellByIds(start.rowId, start.columnId);
  const endCell = store.getCellByIds(end.rowId, end.columnId);

  if (!startCell && !endCell) throw new Error("There are no startCell and endCell in provided range!");
  if (!startCell) throw new Error("There is no startCell in provided range!");
  if (!endCell) throw new Error("There is no startCell in provided range!");

  const startRowIndex = store.rows.findIndex((row) => startCell?.rowId === row.id);
  const endRowIndex = store.rows.findIndex((row) => endCell?.rowId === row.id);
  const startColIndex = store.columns.findIndex((col) => startCell?.colId === col.id);
  const endColIndex = store.columns.findIndex((col) => endCell?.colId === col.id);

  const numericalRange = {
    startRowIdx: startRowIndex,
    startColIdx: startColIndex,
    endRowIdx: endRowIndex,
    endColIdx: endColIndex,
  };

  if (JSON.stringify(numericalRange) === JSON.stringify(EMPTY_AREA)) console.warn('Each of numerical range properties is -1!')

  return numericalRange;
}
