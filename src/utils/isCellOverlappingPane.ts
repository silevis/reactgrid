import { IndexedLocation } from "../types/InternalModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { isTheSameCell } from "./isTheSameCell";

export const isCellOverlappingPane = (
  store: ReactGridStore,
  destinationCellIdx: IndexedLocation,
  panePosition: "left" | "right" | "top" | "bottom"
) => {
  const cell = store.getCellByIndexes(destinationCellIdx.rowIndex, destinationCellIdx.colIndex);
  let paneCell;

  switch (panePosition) {
    case "left":
      paneCell = store.getCellByIndexes(destinationCellIdx.rowIndex, store.paneRanges.Left.endColIdx - 1);
      break;
    case "right":
      paneCell = store.getCellByIndexes(destinationCellIdx.rowIndex, store.paneRanges.Right.startColIdx);
      break;
    case "top":
      paneCell = store.getCellByIndexes(store.paneRanges.TopLeft.endRowIdx - 1, destinationCellIdx.colIndex);
      break;
    case "bottom":
      paneCell = store.getCellByIndexes(store.paneRanges.BottomLeft.startRowIdx, destinationCellIdx.colIndex);
      break;
    default:
      paneCell = null;
  }

  if (!paneCell || !cell) return 0;

  const paneCellContainer = getCellContainer(store, paneCell) as HTMLElement | null;
  const cellContainer = getCellContainer(store, cell) as HTMLElement | null;

  if (!paneCellContainer || !cellContainer) return 0;

  if (isTheSameCell(paneCellContainer, cellContainer)) {
    return 0;
  }

  if (panePosition === "right") {
    const horizontalOffsetDifference = Math.abs(paneCellContainer.offsetLeft - cellContainer.offsetLeft);

    if (cellContainer.offsetLeft + cellContainer.offsetWidth <= paneCellContainer.offsetLeft) {
      return 0;
    }

    return cellContainer.offsetWidth - horizontalOffsetDifference;
  }
  if (panePosition === "left") {
    const horizontalOffsetDifference = Math.abs(
      paneCellContainer.offsetLeft + paneCellContainer.offsetWidth - cellContainer.offsetLeft
    );

    if (cellContainer.offsetLeft >= paneCellContainer.offsetLeft + paneCellContainer.offsetWidth) {
      return 0;
    }

    return horizontalOffsetDifference;
  }
  if (panePosition === "bottom") {
    const verticalOffsetDifference = Math.abs(
      cellContainer.offsetTop + cellContainer.offsetHeight - paneCellContainer.offsetTop
    );

    if (cellContainer.offsetTop + cellContainer.offsetHeight <= paneCellContainer.offsetTop) {
      return 0;
    }
    return verticalOffsetDifference;
  }
  if (panePosition === "top") {
    const verticalOffsetDifference = Math.abs(
      paneCellContainer.offsetTop + paneCellContainer.offsetHeight - cellContainer.offsetTop
    );

    if (cellContainer.offsetTop >= paneCellContainer.offsetTop + paneCellContainer.offsetHeight) {
      return 0;
    }

    return verticalOffsetDifference;
  }
};
