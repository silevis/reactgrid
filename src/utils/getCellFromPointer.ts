import { getRowAndColumns } from "./getRowAndColumns";
import { getContainerFromPoint } from "./getLocationFromClient";


/**
 * Returns the row and column index of the cell that contains the pointer
 * @param clientX - The x coordinate of the pointer
 * @param clientY - The y coordinate of the pointer
 * @returns The row and column index of the cell that contains the pointer
 */

export const getCellFromPointer = (
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
