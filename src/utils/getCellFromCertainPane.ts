import { getRowAndColumns } from "./getRowAndColumns";
import { getCellPane, getStickyPaneDirection } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";

export function getCellFromCertainPane(
  store: ReactGridStore,
  cellContainers: Element[],
  paneName: string
): HTMLElement | undefined {
  const cell = cellContainers.find((container) => {
    const cellIndexes = getRowAndColumns(container);
    if (!cellIndexes) return;

    const { rowIndex, colIndex } = cellIndexes;

    const pane = getCellPane(store, store.getCellByIndexes(rowIndex, colIndex)!);

    return getStickyPaneDirection(pane)?.toLowerCase() === paneName.toLowerCase();
  });
  return cell;
}
