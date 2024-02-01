import { Location } from "../types/InternalModel";

export function getCellContainerLocation(element: HTMLElement): Location {
  const rowIdxRegex = /rgRowIdx-(\d+)/;
  const colIdxRegex = /rgColIdx-(\d+)/;

  const rowIdxMatch = rowIdxRegex.exec(element.classList.value);
  const colIdxMatch = colIdxRegex.exec(element.classList.value);

  if (rowIdxMatch && colIdxMatch) {
    return {
      rowIndex: parseInt(rowIdxMatch[1]),
      colIndex: parseInt(colIdxMatch[1]),
    };
  } else {
    return {
      rowIndex: -1,
      colIndex: -1,
    };
  }
}
