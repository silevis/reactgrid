import { getRowAndColumns } from "./getRowAndColumns";
import { getCellPane, getStickyPaneDirection, isCellSticky } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";
import { getContainerFromPoint } from "./getLocationFromClient";
import { getScrollOfScrollableElement, getScrollableParent } from "./scrollHelpers";
import { calcScrollBy } from "./calcScrollBy";
import { get } from "http";
import { getNonStickyCell } from "./getNonStickyCell";
import { createMultiplierFromDistance } from "./createMultiplierFromDistance";

/**
 * Retrieves the grid cell or coordinates (rowIndex, colIndex) based on pointer coordinates.
 * @param {ReactGridStore} store - The ReactGridStore instance.
 * @param {number} clientX - The X-coordinate of the pointer.
 * @param {number} clientY - The Y-coordinate of the pointer.
 * @returns {HTMLElement | { rowIndex: number; colIndex: number }} - Returns either an HTMLElement representing the cell container or an object containing rowIndex and colIndex.
 */

export const getCellFromPointer = (
  store: ReactGridStore,
  clientX: number,
  clientY: number
): { cell: undefined; rowIndex: -1; colIndex: -1 } | { rowIndex: number; colIndex: number } => {
  // Return if no expectations were met
  const defaultReturn = { cell: undefined, rowIndex: -1, colIndex: -1 };
  // Get HTMLElement that contains rendered cell data
  const cellContainer = getContainerFromPoint(clientX, clientY);

  if (!cellContainer) return defaultReturn;

  // Get information about rows and columns from cellContainer
  const rowsAndColumns = getRowAndColumns(cellContainer);

  if (!rowsAndColumns) return defaultReturn;

  const { rowIndex, colIndex } = rowsAndColumns;
  // Get information about cell based on its row and column
  const hoveredCell = store.getCellByIndexes(rowIndex, colIndex);

  if (!hoveredCell) return defaultReturn;

  if (isCellSticky(store, hoveredCell)) {
    const cellUnderTheSticky = getNonStickyCell(store, clientX, clientY);
    if (!cellUnderTheSticky) return { rowIndex, colIndex };

    const nonStickyRowsAndColumns = getRowAndColumns(cellUnderTheSticky);
    const { rowIndex: secondCellRowIndex, colIndex: secondCellColIndex } = nonStickyRowsAndColumns || {
      rowIndex: -1,
      colIndex: -1,
    };

    return { rowIndex: secondCellRowIndex, colIndex: secondCellColIndex };
  }

  return { rowIndex, colIndex };
};
