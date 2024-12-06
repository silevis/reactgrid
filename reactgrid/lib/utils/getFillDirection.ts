import { EMPTY_AREA } from "../types/InternalModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "./getCellArea";
import { getColumnIdxByPointerLocation } from "./getColumnIdxByPointerLocation";
import { getRowIdxByPointerLocation } from "./getRowIdxByPointerLocation";

type FillDirection = "" | "up" | "down" | "left" | "right";

type Difference = {
  direction: FillDirection;
  value: number | null;
};

export const getFillDirection = (
  store: ReactGridStore,
  pointerLocation: React.PointerEvent<HTMLDivElement> | PointerEvent
): Difference | undefined => {
  const pointerRowIdx = getRowIdxByPointerLocation(store, pointerLocation.clientX, pointerLocation.clientY);
  const pointerColIdx = getColumnIdxByPointerLocation(store, pointerLocation.clientX, pointerLocation.clientY);

  const currectFocusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

  if (pointerRowIdx === -1 || pointerColIdx === -1) return undefined;

  const selectedArea = store.selectedArea;

  const isSelectedArea = store.selectedArea.startRowIdx !== -1;

  let cellArea;
  if (isSelectedArea) {
    cellArea = selectedArea;
  } else if (currectFocusedCell) {
    cellArea = getCellArea(store, currectFocusedCell);
  } else {
    cellArea = EMPTY_AREA;
  }

  const bottomDiff = pointerRowIdx >= cellArea.endRowIdx ? Math.abs(pointerRowIdx + 1 - cellArea.endRowIdx) : 0;
  const topDiff = pointerRowIdx <= cellArea.startRowIdx ? Math.abs(pointerRowIdx - cellArea.startRowIdx) : 0;
  const rightDiff = pointerColIdx >= cellArea.endColIdx ? Math.abs(pointerColIdx + 1 - cellArea.endColIdx) : 0;
  const leftDiff = pointerColIdx <= cellArea.startColIdx ? Math.abs(pointerColIdx - cellArea.startColIdx) : 0;

  if (pointerRowIdx >= cellArea.endRowIdx) {
    if (bottomDiff >= rightDiff && bottomDiff >= leftDiff) {
      return {
        direction: "down",
        value: pointerRowIdx,
      };
    }
  }
  if (pointerRowIdx <= cellArea.startRowIdx) {
    if (topDiff >= rightDiff && topDiff >= leftDiff) {
      return {
        direction: "up",
        value: pointerRowIdx,
      };
    }
  }
  if (pointerColIdx >= cellArea.endColIdx) {
    if (rightDiff > topDiff && rightDiff > bottomDiff) {
      return {
        direction: "right",
        value: pointerColIdx,
      };
    }
  }
  if (pointerColIdx <= cellArea.startColIdx) {
    if (leftDiff > topDiff && leftDiff > bottomDiff) {
      return {
        direction: "left",
        value: pointerColIdx,
      };
    }
  }
};
