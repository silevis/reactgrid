import { getCellIndexes } from "./getCellIndexes";
import { getCellPane, getStickyPaneDirection } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";

export function getCellFromCertainPane(
  store: ReactGridStore,
  cellContainers: Element[],
  paneName: string
): Element | undefined {
  return cellContainers.find((container) => {
    const cellIndexes = getCellIndexes(container);
    if (!cellIndexes) return;

    const { rowIndex, colIndex } = cellIndexes;

    const pane = getCellPane(store, store.getCellByIndexes(rowIndex, colIndex)!);

    return getStickyPaneDirection(pane)?.toLowerCase() === paneName.toLowerCase();
  });
}
