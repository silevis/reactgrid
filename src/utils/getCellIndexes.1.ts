import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore.ts";

/**
 * Returns the indexes of a cell in the ReactGrid store.
 * @param store - The ReactGrid store.
 * @param cell - The cell to find the indexes for.
 * @returns An object containing the row index and column index of the cell.
 */

export function getCellIndexes(store: ReactGridStore, cell: Cell): { rowIndex: number; colIndex: number; } {
  const rowIndex = store.rows.findIndex((row) => row.id === cell.rowId);
  const colIndex = store.columns.findIndex((col) => col.id === cell.colId);

  return {
    rowIndex,
    colIndex,
  };
}
