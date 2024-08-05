import { Cell } from "../types/PublicModel";
import { getCellIndexesFromContainerElement } from "./getCellIndexes";

export function isTheSameCell(firstCell: Cell, secondCell: Cell): boolean;
export function isTheSameCell(firstCell: HTMLElement, secondCell: HTMLElement): boolean;

export function isTheSameCell(firstCell: Cell | HTMLElement, secondCell: Cell | HTMLElement): boolean | null {
  const isBasedOnContainers = "rowIndex" in firstCell === false && "rowIndex" in secondCell === false;

  if (isBasedOnContainers) {
    const firstIndexes = getCellIndexesFromContainerElement(firstCell);
    const secondIndexes = getCellIndexesFromContainerElement(secondCell);

    return (
      firstIndexes &&
      secondIndexes &&
      firstIndexes.rowIndex === secondIndexes.rowIndex &&
      firstIndexes.colIndex === secondIndexes.colIndex
    );
  } else if ("rowIndex" in firstCell && "rowIndex" in secondCell) {
    return firstCell.rowIndex === secondCell.rowIndex && firstCell.colIndex === secondCell.colIndex;
  } else {
    return null;
  }
}
