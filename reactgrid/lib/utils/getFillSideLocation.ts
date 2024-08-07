import isEqual from "lodash.isequal";
import { EMPTY_AREA } from "../types/InternalModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "./getCellArea";

type FillDirection = "" | "top" | "bottom" | "left" | "right";

export function getFillSideLocation(store: ReactGridStore): FillDirection {
  const { fillHandleArea, selectedArea, getFocusedCell } = store;

  const focusedCell = getFocusedCell();

  const focusedCellArea = focusedCell ? getCellArea(store, focusedCell) : EMPTY_AREA;

  const relativeLocation = !isEqual(selectedArea, EMPTY_AREA) ? selectedArea : focusedCellArea;

  if (fillHandleArea.startRowIdx === relativeLocation.endRowIdx) {
    return "bottom";
  } else if (fillHandleArea.endRowIdx === relativeLocation.startRowIdx) {
    return "top";
  } else if (fillHandleArea.startColIdx === relativeLocation.endColIdx) {
    return "right";
  } else if (fillHandleArea.endColIdx === relativeLocation.startColIdx) {
    return "left";
  }
  return "";
}
