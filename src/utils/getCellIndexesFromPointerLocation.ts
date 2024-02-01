import { getCellIndexesFromContainerElement } from "./getCellIndexes";
import { getCellContainerFromPoint } from "./getCellContainerFromPoint";


/**
 * Returns the row and column index of the cell that contains the pointer
 * @param clientX - The x coordinate of the pointer
 * @param clientY - The y coordinate of the pointer
 * @returns The row and column index of the cell that contains the pointer
 */

export const getCellIndexesFromPointerLocation = (
  clientX: number,
  clientY: number
): {  rowIndex: -1; colIndex: -1 } | { rowIndex: number; colIndex: number } => {
  // Return if no expectations were met
  const noCellIndexes = {  rowIndex: -1, colIndex: -1 };
  // Get HTMLElement that contains rendered cell data
  const cellContainer = getCellContainerFromPoint(clientX, clientY);

  if (!cellContainer) return noCellIndexes;

  // Get information about rows and columns from cellContainer
  const cellIndexes = getCellIndexesFromContainerElement(cellContainer);

  if (!cellIndexes) return noCellIndexes;

  const { rowIndex, colIndex } = cellIndexes;
  

  return { rowIndex, colIndex };
};
