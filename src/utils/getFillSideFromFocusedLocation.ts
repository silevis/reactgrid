import { ReactGridStore } from "../types/ReactGridStore";

type FillDirection = "" | "top" | "bottom" | "left" | "right";

export function getFillSideFromFocusedLocation(store: ReactGridStore): FillDirection {
  const { fillHandleArea, focusedLocation } = store;

  if (fillHandleArea.startRowIdx > focusedLocation.rowIndex) {
    return "bottom";
  } else if (fillHandleArea.endRowIdx <= focusedLocation.rowIndex) {
    return "top";
  } else if (fillHandleArea.startColIdx > focusedLocation.colIndex) {
    return "right";
  } else if (fillHandleArea.endColIdx <= focusedLocation.colIndex) {
    return "left";
  }
  return "";
}
