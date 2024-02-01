import { FocusedCell } from "../types/InternalModel";
import { EMPTY_AREA, areAreasEqual, findMinimalSelectedArea, getCellArea, isCellInRange } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";

type ResizeDirection = "Up" | "Down" | "Left" | "Right";

/**
 * Tries to resize the selected area towards the given direction.
 *
 * If nothing changed even after trying to reduce / expand
 * try again but at a greater distance
 * until the area changes or we reach the end of the grid.
 *
 * @param store RGStore
 * @param focusedCell current focused cell
 * @param direction direction in which to resize
 * @param changeOffset by how much to change the selected area
 * @returns the updated store
 */
export const resizeSelectionInDirection = (
  store: ReactGridStore,
  focusedCell: FocusedCell,
  direction: ResizeDirection,
  changeOffset: number = 1
): ReactGridStore => {
  const focusedCellArea = getCellArea(store, focusedCell);
  const selectedArea = !areAreasEqual(store.selectedArea, EMPTY_AREA)
    ? { ...store.selectedArea }
    : { ...focusedCellArea };

  switch (direction) {
    case "Left": {
      if (selectedArea.endColIdx > focusedCellArea.endColIdx) {
        selectedArea.endColIdx -= changeOffset;
        if (!isCellInRange(store, focusedCell, selectedArea)) {
          selectedArea.endColIdx += changeOffset;
          changeOffset = 1;
          selectedArea.startColIdx -= changeOffset;
        }
      } else {
        selectedArea.startColIdx -= changeOffset;
      }

      break;
    }
    case "Right": {
      if (selectedArea.startColIdx < focusedCell.colIndex) {
        selectedArea.startColIdx += changeOffset;
        if (!isCellInRange(store, focusedCell, selectedArea)) {
          selectedArea.startColIdx -= changeOffset;
          changeOffset = 1;
          selectedArea.endColIdx += changeOffset;
        }
      } else {
        selectedArea.endColIdx += changeOffset;
      }

      break;
    }
    case "Up": {
      if (selectedArea.endRowIdx > focusedCellArea.endRowIdx) {
        selectedArea.endRowIdx -= changeOffset;
        if (!isCellInRange(store, focusedCell, selectedArea)) {
          selectedArea.endRowIdx += changeOffset;
          changeOffset = 1;
          selectedArea.startRowIdx -= changeOffset;
        }
      } else {
        selectedArea.startRowIdx -= changeOffset;
      }

      break;
    }
    case "Down": {
      if (selectedArea.startRowIdx < focusedCell.rowIndex) {
        selectedArea.startRowIdx += changeOffset;
        if (!isCellInRange(store, focusedCell, selectedArea)) {
          selectedArea.startRowIdx -= changeOffset;
          changeOffset = 1;
          selectedArea.endRowIdx += changeOffset;
        }
      } else {
        selectedArea.endRowIdx += changeOffset;
      }

      break;
    }
  }

  // Don't allow to go beyond the grid
  const { columns, rows } = store;
  const { startColIdx, endColIdx, startRowIdx, endRowIdx } = selectedArea;

  const isOutOfBounds =
    startColIdx < 0 ||
    endColIdx < 0 ||
    startRowIdx < 0 ||
    endRowIdx < 0 ||
    endColIdx > columns.length ||
    startRowIdx > rows.length ||
    endRowIdx > rows.length ||
    startColIdx > columns.length;

  if (isOutOfBounds) {
    return store;
  }

  if (areAreasEqual(selectedArea, focusedCellArea)) {
    return {
      ...store,
      selectedArea: EMPTY_AREA,
    };
  }

  const newSelectedArea = findMinimalSelectedArea(store, selectedArea);
  if (areAreasEqual(newSelectedArea, store.selectedArea)) {
    return resizeSelectionInDirection(store, focusedCell, direction, changeOffset + 1);
  }

  return {
    ...store,
    selectedArea: {
      ...newSelectedArea,
    },
  };
};
