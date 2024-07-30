import { IndexedLocation } from "../types/InternalModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";
import { isCellInPane } from "./isCellInPane";
import { isPaneExists } from "./isPaneExists";
import { isTheSameCell } from "./isTheSameCell";
import { Cell } from "../types/PublicModel";

export const getCellPaneOverlap = (
  store: ReactGridStore,
  destinationCellIdx: IndexedLocation,
  panePosition: "Left" | "Right" | "TopCenter" | "BottomCenter"
) => {
  const cell = store.getCellByIndexes(destinationCellIdx.rowIndex, destinationCellIdx.colIndex);

  if (!cell || !isPaneExists(store, panePosition)) {
    return 0;
  }

  let edgePaneCell: Cell | null = null;

  switch (panePosition) {
    case "Left":
      edgePaneCell = store.getCellByIndexes(destinationCellIdx.rowIndex, store.paneRanges.Left.endColIdx - 1);
      break;
    case "Right":
      edgePaneCell = store.getCellByIndexes(destinationCellIdx.rowIndex, store.paneRanges.Right.startColIdx);
      break;
    case "TopCenter":
      edgePaneCell = store.getCellByIndexes(store.paneRanges.TopCenter.endRowIdx - 1, destinationCellIdx.colIndex);
      break;
    case "BottomCenter":
      edgePaneCell = store.getCellByIndexes(store.paneRanges.BottomCenter.startRowIdx, destinationCellIdx.colIndex);
      break;
  }

  if (
    !edgePaneCell ||
    isCellInPane(store, cell, panePosition) ||
    isCellInPane(store, cell, "TopRight") ||
    isCellInPane(store, cell, "BottomRight") ||
    isCellInPane(store, cell, "TopLeft") ||
    isCellInPane(store, cell, "BottomLeft")
  ) {
    return 0;
  }

  const edgePaneCellContainer = getCellContainer(store, edgePaneCell);
  const cellContainer = getCellContainer(store, cell);

  if (!edgePaneCellContainer || !cellContainer) return 0;

  if (isTheSameCell(edgePaneCellContainer, cellContainer)) {
    return 0;
  }

  if (panePosition === "Right") {
    const horizontalOffsetDifference = Math.abs(
      edgePaneCellContainer.offsetLeft - (cellContainer.offsetLeft + cellContainer.offsetWidth)
    );

    if (cellContainer.offsetLeft + cellContainer.offsetWidth <= edgePaneCellContainer.offsetLeft) {
      return 0;
    }

    return horizontalOffsetDifference;
  }
  if (panePosition === "Left") {
    const horizontalOffsetDifference = Math.abs(
      edgePaneCellContainer.offsetLeft + edgePaneCellContainer.offsetWidth - cellContainer.offsetLeft
    );

    if (cellContainer.offsetLeft >= edgePaneCellContainer.offsetLeft + edgePaneCellContainer.offsetWidth) {
      return 0;
    }

    return horizontalOffsetDifference;
  }
  if (panePosition === "BottomCenter") {
    const verticalOffsetDifference = Math.abs(
      cellContainer.offsetTop + cellContainer.offsetHeight - edgePaneCellContainer.offsetTop
    );

    if (cellContainer.offsetTop + cellContainer.offsetHeight <= edgePaneCellContainer.offsetTop) {
      return 0;
    }
    return verticalOffsetDifference;
  }
  if (panePosition === "TopCenter") {
    const verticalOffsetDifference = Math.abs(
      edgePaneCellContainer.offsetTop + edgePaneCellContainer.offsetHeight - cellContainer.offsetTop
    );

    if (cellContainer.offsetTop >= edgePaneCellContainer.offsetTop + edgePaneCellContainer.offsetHeight) {
      return 0;
    }

    return verticalOffsetDifference;
  }
};
