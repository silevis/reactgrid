import { Cell } from "../types/PublicModel";
import { getCellIndexesFromContainerElement } from "./getCellIndexes";

export function isTheSameCell(firstCell: Cell, secondCell: Cell): boolean;
export function isTheSameCell(firstCell: HTMLElement, secondCell: HTMLElement): boolean;

export function isTheSameCell(firstCell: Cell | HTMLElement, secondCell: Cell | HTMLElement): boolean | null {
  const isBasedOnContainers = "rowId" in firstCell === false && "rowId" in secondCell === false;

  if (isBasedOnContainers) {
    const firstIndexes = getCellIndexesFromContainerElement(firstCell);
    const secondIndexes = getCellIndexesFromContainerElement(secondCell);

    return (
      firstIndexes &&
      secondIndexes &&
      firstIndexes.rowIndex === secondIndexes.rowIndex &&
      firstIndexes.colIndex === secondIndexes.colIndex
    );
  } else if ("rowId" in firstCell && "rowId" in secondCell) {
    return firstCell.rowId === secondCell.rowId && firstCell.colId === secondCell.colId;
  } else {
    return null;
  }
}
