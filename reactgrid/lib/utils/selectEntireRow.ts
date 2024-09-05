import { NumericalRange } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { findMinimalSelectedArea } from "./findMinimalSelectedArea";

export function selectEntireRow(store: ReactGridStore, cellArea: NumericalRange) {
  return findMinimalSelectedArea(store, {
    startRowIdx: cellArea.startRowIdx,
    endRowIdx: cellArea.endRowIdx,
    startColIdx: 0,
    endColIdx: store.columns.length,
  });
}
