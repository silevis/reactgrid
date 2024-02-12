import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { isCellInRange } from "./isCellInRange";

/**
 * Checks if a cell is sticky.
 * @param store - The ReactGridStore object.
 * @param cell - The cell object to check.
 * @returns True if the cell is on sticky pane, false otherwise.
 */
export function isCellSticky(store: ReactGridStore, cell: Cell): boolean {
  return !isCellInRange(store, cell, store.paneRanges.Center);
}
