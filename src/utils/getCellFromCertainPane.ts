import { getRowAndColumns } from "./getRowAndColumns";
import { getCellPane, getStickyPaneDirection } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";

export function getCellFromCertainPane(
  store: ReactGridStore,
  cellContainers: Element[],
  paneName: string
): HTMLElement | undefined {
  let cell;

  cellContainers.forEach((container) => {
    const rowsAndCols = getRowAndColumns(container);
    if (!rowsAndCols) return;

    const { rowIndex, colIndex } = rowsAndCols;

    const pane = getCellPane(store, store.getCellByIndexes(rowIndex, colIndex)!);

    if (getStickyPaneDirection(pane)?.toLowerCase() === paneName.toLowerCase()) cell = container;
  });
  return cell;
}
