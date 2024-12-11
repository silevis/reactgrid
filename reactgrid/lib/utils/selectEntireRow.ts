import { NumericalRange } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { findMinimalSelectedArea } from "./findMinimalSelectedArea";
import { isSpanMember } from "./isSpanMember";

export function selectEntireRow(store: ReactGridStore, cellArea: NumericalRange) {
  const cells = store.cells;

  for (let rowIdx = cellArea.startRowIdx; rowIdx < cellArea.endRowIdx; rowIdx++) {
    const firstCell = cells.get(`${rowIdx} 0`);

    if (!firstCell) return store.selectedArea;

    if (isSpanMember(firstCell)) {
      const originCell = store.getCellByIndexes(firstCell.originRowIndex, firstCell.originColIndex);
      if (originCell && (originCell.isSelectable === false || originCell.isFocusable === false)) {
        return store.selectedArea;
      }
    } else {
      if (firstCell.isSelectable === false || firstCell.isFocusable === false) {
        return store.selectedArea;
      }
    }
  }

  return findMinimalSelectedArea(store, {
    startRowIdx: cellArea.startRowIdx,
    endRowIdx: cellArea.endRowIdx,
    startColIdx: 0,
    endColIdx: store.columns.length,
  });
}
