import { NumericalRange } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { findMinimalSelectedArea } from "./findMinimalSelectedArea";
import { isSpanMember } from "./isSpanMember";

export function selectEntireColumn(store: ReactGridStore, cellArea: NumericalRange) {
  const cells = store.cells;

  for (let colIdx = cellArea.startColIdx; colIdx < cellArea.endColIdx; colIdx++) {
    const firstCell = cells.get(`0 ${colIdx}`);

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
    startRowIdx: 0,
    endRowIdx: store.rows.length,
    startColIdx: cellArea.startColIdx,
    endColIdx: cellArea.endColIdx,
  });
}
