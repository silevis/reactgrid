import { NumericalRange } from "../types/CellMatrix";
import { Range } from "../types/PublicModel";
import { areAreasEqual } from "./cellUtils";
import { EMPTY_AREA } from "../types/InternalModel";
import { ReactGridStore } from "./reactGridStore";

export function getNumericalRange(store: ReactGridStore, range: Range): NumericalRange {
  const { start, end } = range;

  const startCell = store.getCellByIds(start.rowId, start.columnId);
  const endCell = store.getCellByIds(end.rowId, end.columnId);

  if (!startCell) throw new Error("Could not find a startCell with provided id's");
  else if (!endCell) throw new Error("Could not find a endCell with provided id's");

  const startRowIndex = store.rows.findIndex((row) => startCell.rowId === row.id);
  const endRowIndex = store.rows.findIndex((row) => endCell.rowId === row.id);
  const startColIndex = store.columns.findIndex((col) => startCell.colId === col.id);
  const endColIndex = store.columns.findIndex((col) => endCell.colId === col.id);

  const numericalRange: NumericalRange = {
    startRowIdx: startRowIndex,
    startColIdx: startColIndex,
    endRowIdx: endRowIndex,
    endColIdx: endColIndex,
  };

  if (areAreasEqual(numericalRange, EMPTY_AREA)) console.warn("Each of numerical range properties is -1!");

  return numericalRange;
}
