import { PaneName } from "../types/InternalModel.ts";
import { isCellInRange } from "./isCellInRange.ts";
import { getCellIndexesFromContainerElement } from "./getCellIndexes.ts";

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
