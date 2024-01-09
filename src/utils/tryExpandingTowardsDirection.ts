import { FocusedCell } from "../types/InternalModel";
import { EMPTY_AREA, areAreasEqual, findMinimalSelectedArea, getCellArea } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";

type Direction = "Up" | "Down" | "Left" | "Right";

// If nothing changed even after trying to reduce / expand
// try again but at a greater distance
// until the area changes.
// Does not yet work if the area cant be reduced in the choosen direction
// and should be expanded instead from the other side.

export const tryExpandingTowardsDirection = (
  store: ReactGridStore,
  focusedCell: FocusedCell,
  direction: Direction,
  changeOffset: number = 1
): ReactGridStore => {
  const focusedCellArea = getCellArea(store, focusedCell);
  const selectedArea = !areAreasEqual(store.selectedArea, EMPTY_AREA) ? { ...store.selectedArea } : { ...focusedCellArea };

  switch (direction) {
    case "Left": {
      if (selectedArea.endColIdx > focusedCellArea.endColIdx) {
        selectedArea.endColIdx -= changeOffset;
      } else {
        selectedArea.startColIdx -= changeOffset;
      }

      break;
    }
    case "Right": {
      if (selectedArea.startColIdx < focusedCell.colIndex) {
        selectedArea.startColIdx += changeOffset;
      } else {
        selectedArea.endColIdx += changeOffset;
      }
    
      break;
    }
    case "Up": {
      if (selectedArea.endRowIdx > focusedCellArea.endRowIdx) {
        selectedArea.endRowIdx -= changeOffset;
      } else {
        selectedArea.startRowIdx -= changeOffset;
      }

      break;
    }
    case "Down": {
      if (selectedArea.startRowIdx < focusedCell.rowIndex) {
        selectedArea.startRowIdx += changeOffset;
      } else {
        selectedArea.endRowIdx += changeOffset;
      }

      break;
    }
  }

  if (areAreasEqual(selectedArea, focusedCellArea)) {
    return {
      ...store,
      selectedArea: EMPTY_AREA,
    };
  } 
  
  
  // debugger;
  const newSelectedArea = findMinimalSelectedArea(store, selectedArea);
  if (areAreasEqual(newSelectedArea, store.selectedArea)) {
    return tryExpandingTowardsDirection(store, focusedCell, direction, changeOffset + 1);
  }
  
  return {
    ...store,
    selectedArea: {
      ...newSelectedArea,
    },
  };
};