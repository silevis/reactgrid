import { NumericalRange } from "../types/PublicModel.ts";
import { Range } from "../types/PublicModel.ts";
import { areAreasEqual } from "./areAreasEqual.ts";
import { EMPTY_AREA } from "../types/InternalModel.ts";

import { ReactGridStore } from "../types/ReactGridStore.ts";

export function getNumericalRange(store: ReactGridStore, range: Range): NumericalRange {
  const { start, end } = range;

  const startCell = store.getCellByIndexes(start.rowIndex, start.columnIndex);
  const endCell = store.getCellByIndexes(end.rowIndex, end.columnIndex);

  if (!startCell) throw new Error("Could not find a startCell with provided indexes");
  else if (!endCell) throw new Error("Could not find a endCell with provided indexes");

  const numericalRange: NumericalRange = {
    startRowIdx: start.rowIndex,
    startColIdx: start.columnIndex,
    endRowIdx: end.rowIndex,
    endColIdx: end.columnIndex,
  };

  if (areAreasEqual(numericalRange, EMPTY_AREA)) console.warn("Each of numerical range properties is -1!");

  return numericalRange;
}
