import { PaneName } from "../types/InternalModel";
import { isCellInRange } from "./cellUtils";
import { getCellIndexesFromContainerElement } from "./getCellIndexes";

import { ReactGridStore } from "../types/ReactGridStore.ts";

export function getCellFromCertainPane(
  store: ReactGridStore,
  cellContainers: Element[],
  paneName: PaneName
): Element | undefined {
  return cellContainers.find((container) => {
    const cellIndexes = getCellIndexesFromContainerElement(container);
    if (!cellIndexes) return;

    const { rowIndex, colIndex } = cellIndexes;

    return isCellInRange(store, store.getCellByIndexes(rowIndex, colIndex)!, store.paneRanges[paneName]);
  });
}
