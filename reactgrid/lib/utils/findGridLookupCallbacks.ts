import { NumericalRange } from "../main";
import { GridLookup, GridLookupCallbacks } from "../types/InternalModel";

export function findGridLookupCallbacks(cellsArea: NumericalRange, gridLookup: GridLookup): GridLookupCallbacks[] {
  const { startRowIdx, endRowIdx, startColIdx, endColIdx } = cellsArea;
  const foundElements: GridLookupCallbacks[] = [];

  for (let rowIdx = startRowIdx; rowIdx < endRowIdx; rowIdx++) {
    for (let colIdx = startColIdx; colIdx < endColIdx; colIdx++) {
      const element = gridLookup.get(`${rowIdx} ${colIdx}`);
      if (element) {
        foundElements.push(element);
      }
    }
  }

  return foundElements;
}
