import { ReactGridStore } from "./reactGridStore";
import { getCellFromCertainPane } from "./getCellFromCertainPane";


export function getNonStickyCell(store: ReactGridStore, clientX: number, clientY: number): HTMLElement | undefined {
  const cellContainers = document
    .elementsFromPoint(clientX, clientY)
    .filter((el) => el.classList.contains("rgCellContainer"));

  const nonStickyCell = getCellFromCertainPane(store, cellContainers, "center");
  return nonStickyCell;
}
