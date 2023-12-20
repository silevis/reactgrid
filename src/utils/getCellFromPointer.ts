import { getRowAndColumns } from "./getRowAndColumns";
import { ReactGridStore } from "./reactGridStore";
import { getContainerFromPoint } from "./getLocationFromClient";


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
): {  rowIndex: -1; colIndex: -1 } | { rowIndex: number; colIndex: number } => {
  // Return if no expectations were met
  const defaultReturn = {  rowIndex: -1, colIndex: -1 };
  // Get HTMLElement that contains rendered cell data
  const cellContainer = getContainerFromPoint(clientX, clientY);

  if (!cellContainer) return defaultReturn;

  // Get information about rows and columns from cellContainer
  const rowsAndColumns = getRowAndColumns(cellContainer);

  if (!rowsAndColumns) return defaultReturn;

  const { rowIndex, colIndex } = rowsAndColumns;
  

  return { rowIndex, colIndex };
};
