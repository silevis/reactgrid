import { ReactGridStore } from "./reactGridStore";
import { getCellFromCertainPane } from "./getCellFromCertainPane";


/**
 * Retrieves the non-sticky cell element based on the provided coordinates.
 * @param store - The ReactGridStore instance.
 * @param clientX - The x-coordinate of the mouse pointer.
 * @param clientY - The y-coordinate of the mouse pointer.
 * @returns The HTMLElement representing the non-sticky cell, or undefined if not found.
 */

export function getNonStickyCell(store: ReactGridStore, clientX: number, clientY: number): HTMLElement | undefined {
  const cellContainers = document
    .elementsFromPoint(clientX, clientY)
    .filter((el) => el.classList.contains("rgCellContainer"));

  const nonStickyCell = getCellFromCertainPane(store, cellContainers, "center");
  return nonStickyCell;
}
