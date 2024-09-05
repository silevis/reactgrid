import { PaneName } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { getCellIndexesFromContainerElement } from "./getCellIndexes";

export const getPaneNameByCell = (store: ReactGridStore, cell: Cell | null): PaneName | null => {
  if (!cell) return null;

  const cellContainer = getCellContainer(store, cell);

  if (!cellContainer) return null;

  const cellIdx = getCellIndexesFromContainerElement(cellContainer);

  for (const pane in store.paneRanges) {
    const range = store.paneRanges[pane as PaneName];
    if (
      cellIdx.rowIndex >= range.startRowIdx &&
      cellIdx.rowIndex < range.endRowIdx &&
      cellIdx.colIndex >= range.startColIdx &&
      cellIdx.colIndex < range.endColIdx
    ) {
      return pane as PaneName;
    }
  }

  return null;
};
