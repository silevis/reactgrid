import { NumericalRange } from "../types/CellMatrix.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { getCellArea } from "./getCellArea.ts";

export const findMinimalSelectedArea = (store: ReactGridStore, currentArea: NumericalRange): NumericalRange => {
  let didChange = false;
  const minimalArea: NumericalRange = { ...currentArea };

  for (let rowIndex = currentArea.startRowIdx; rowIndex < currentArea.endRowIdx; rowIndex++) {
    for (let colIndex = currentArea.startColIdx; colIndex < currentArea.endColIdx; colIndex++) {
      const cell = store.getCellByIndexes(rowIndex, colIndex);
      if (!cell) continue;

      const area = getCellArea(store, cell);

      if (area.startRowIdx < minimalArea.startRowIdx) {
        minimalArea.startRowIdx = area.startRowIdx;
        didChange = true;
      }
      if (area.endRowIdx > minimalArea.endRowIdx) {
        minimalArea.endRowIdx = area.endRowIdx;
        didChange = true;
      }
      if (area.startColIdx < minimalArea.startColIdx) {
        minimalArea.startColIdx = area.startColIdx;
        didChange = true;
      }
      if (area.endColIdx > minimalArea.endColIdx) {
        minimalArea.endColIdx = area.endColIdx;
        didChange = true;
      }
    }
  }

  if (didChange) {
    return findMinimalSelectedArea(store, minimalArea);
  }

  return minimalArea;
};
