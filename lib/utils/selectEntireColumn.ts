import { NumericalRange } from "../types/CellMatrix";
import { ReactGridStore } from "../types/ReactGridStore";
import { findMinimalSelectedArea } from "./findMinimalSelectedArea";

export function selectEntireColumn(store: ReactGridStore, cellArea: NumericalRange) {
  return findMinimalSelectedArea(store, {
    startRowIdx: 0,
    endRowIdx: store.rows.length,
    startColIdx: cellArea.startColIdx,
    endColIdx: cellArea.endColIdx,
  });
}
