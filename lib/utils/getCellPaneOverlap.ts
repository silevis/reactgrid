import { IndexedLocation } from "../types/InternalModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { isCellInPane } from "./isCellInPane";
import { isTheSameCell } from "./isTheSameCell";

// TODO: rename
export const getCellPaneOverlap = (
  store: ReactGridStore,
  destinationCellIdx: IndexedLocation,
  panePosition: "Top" | "Bottom" | "Right" | "Left"
) => {
  const cell = store.getCellByIndexes(destinationCellIdx.rowIndex, destinationCellIdx.colIndex);
  let paneCell;

  switch (panePosition) {
    case "Left":
      paneCell = store.getCellByIndexes(destinationCellIdx.rowIndex, store.paneRanges.Left.endColIdx - 1);
      break;
    case "Right":
      paneCell = store.getCellByIndexes(destinationCellIdx.rowIndex, store.paneRanges.Right.startColIdx);
      break;
    case "Top":
      paneCell = store.getCellByIndexes(store.paneRanges.TopLeft.endRowIdx - 1, destinationCellIdx.colIndex);
      break;
    case "Bottom":
      paneCell = store.getCellByIndexes(store.paneRanges.BottomLeft.startRowIdx, destinationCellIdx.colIndex);
      break;
    default:
      paneCell = null;
  }

  if (!paneCell || !cell || isCellInPane(store, cell, panePosition)) return 0;

  const paneCellContainer = getCellContainer(store, paneCell);
  const cellContainer = getCellContainer(store, cell);

  if (!paneCellContainer || !cellContainer) return 0;

  if (isTheSameCell(paneCellContainer, cellContainer)) {
    return 0;
  }

  if (panePosition === "Right") {
    const horizontalOffsetDifference = Math.abs(
      paneCellContainer.offsetLeft - (cellContainer.offsetLeft + cellContainer.offsetWidth)
    );

    if (cellContainer.offsetLeft + cellContainer.offsetWidth <= paneCellContainer.offsetLeft) {
      return 0;
    }

    return horizontalOffsetDifference;
  }
  if (panePosition === "Left") {
    const horizontalOffsetDifference = Math.abs(
      paneCellContainer.offsetLeft + paneCellContainer.offsetWidth - cellContainer.offsetLeft
    );

    if (cellContainer.offsetLeft >= paneCellContainer.offsetLeft + paneCellContainer.offsetWidth) {
      return 0;
    }

    return horizontalOffsetDifference;
  }
  if (panePosition === "Bottom") {
    const verticalOffsetDifference = Math.abs(
      cellContainer.offsetTop + cellContainer.offsetHeight - paneCellContainer.offsetTop
    );

    if (cellContainer.offsetTop + cellContainer.offsetHeight <= paneCellContainer.offsetTop) {
      return 0;
    }
    return verticalOffsetDifference;
  }
  if (panePosition === "Top") {
    const verticalOffsetDifference = Math.abs(
      paneCellContainer.offsetTop + paneCellContainer.offsetHeight - cellContainer.offsetTop
    );

    if (cellContainer.offsetTop >= paneCellContainer.offsetTop + paneCellContainer.offsetHeight) {
      return 0;
    }

    return verticalOffsetDifference;
  }
};
