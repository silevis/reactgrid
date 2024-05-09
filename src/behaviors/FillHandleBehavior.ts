import { Behavior } from "../types/Behavior";
import { NumericalRange } from "../types/CellMatrix";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "../utils/getCellArea";
import { getCellIndexesFromPointerLocation } from "../utils/getCellIndexesFromPointerLocation";
import { getFillDirection } from "../utils/getFillDirection";
import { getFillSideFromFocusedLocation } from "../utils/getFillSideFromFocusedLocation";
import isDevEnvironment from "../utils/isDevEnvironment";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky";

const devEnvironment = isDevEnvironment();

export const FillHandleBehavior: Behavior = {
  id: "FillHandle",
  handlePointerDown: function (event, store): ReactGridStore {
    devEnvironment && console.log("FHB/handlePointerDown");
    return store;
  },
  handlePointerMove: function (event, store): ReactGridStore {
    devEnvironment && console.log("FHB/handlePointerMove");
    const fillDirection = getFillDirection(store, event);
    const focusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

    const { clientX, clientY } = event;
    const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(clientX, clientY);

    const currentDragOverCell = store.getCellByIndexes(rowIndex, colIndex);

    if (currentDragOverCell) scrollTowardsSticky(store, currentDragOverCell, { rowIndex, colIndex });

    const selectedArea = store.selectedArea;

    const isSelectedArea = store.selectedArea.startRowIdx !== -1;

    if (!focusedCell) return store;

    const focusedCellArea = getCellArea(store, focusedCell);

    if (!fillDirection || fillDirection.value === null) {
      return store;
    }

    switch (fillDirection?.direction) {
      case "up": {
        return {
          ...store,
          fillHandleArea: {
            startColIdx: isSelectedArea ? selectedArea.startColIdx : focusedCellArea.startColIdx,
            startRowIdx: fillDirection.value,
            endColIdx: isSelectedArea ? selectedArea.endColIdx : focusedCellArea.endColIdx,
            endRowIdx: isSelectedArea ? selectedArea.startRowIdx : focusedCellArea.startRowIdx,
          },
        };
      }
      case "right": {
        return {
          ...store,
          fillHandleArea: {
            startColIdx: isSelectedArea ? selectedArea.endColIdx : focusedCellArea.endColIdx,
            startRowIdx: isSelectedArea ? selectedArea.startRowIdx : focusedCellArea.startRowIdx,
            endColIdx: fillDirection.value + 1,
            endRowIdx: isSelectedArea ? selectedArea.endRowIdx : focusedCellArea.endRowIdx,
          },
        };
      }
      case "down": {
        return {
          ...store,
          fillHandleArea: {
            startColIdx: isSelectedArea ? selectedArea.startColIdx : focusedCellArea.startColIdx,
            startRowIdx: isSelectedArea ? selectedArea.endRowIdx : focusedCellArea.endRowIdx,
            endColIdx: isSelectedArea ? selectedArea.endColIdx : focusedCellArea.endColIdx,
            endRowIdx: fillDirection.value + 1,
          },
        };
      }
      case "left": {
        return {
          ...store,
          fillHandleArea: {
            startColIdx: fillDirection.value,
            startRowIdx: isSelectedArea ? selectedArea.startRowIdx : focusedCellArea.startRowIdx,
            endColIdx: isSelectedArea ? selectedArea.startColIdx : focusedCellArea.startColIdx,
            endRowIdx: isSelectedArea ? selectedArea.endRowIdx : focusedCellArea.endRowIdx,
          },
        };
      }
    }

    return store;
  },
  handlePointerUp: function (event, store): ReactGridStore {
    devEnvironment && console.log("FHB/handlePointerUp");
    const side = getFillSideFromFocusedLocation(store);

    const focusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

    if (!focusedCell) return store;

    const previouslySelectedArea = store.selectedArea;

    if (store.fillHandleArea.startRowIdx !== -1) {
      let selectedArea: NumericalRange;

      if (store.selectedArea.startRowIdx !== -1) {
        selectedArea = store.selectedArea;
      } else {
        selectedArea = getCellArea(store, focusedCell);
      }

      store.onFillHandle?.(selectedArea, store.fillHandleArea);
    }

    const isPreviouslySelectedArea = previouslySelectedArea.startRowIdx !== -1;

    const newSelectedArea = store.fillHandleArea;

    if (side === "bottom") {
      if (isPreviouslySelectedArea) {
        newSelectedArea.startRowIdx =
          newSelectedArea.startRowIdx - (previouslySelectedArea.endRowIdx - previouslySelectedArea.startRowIdx);
      } else newSelectedArea.startRowIdx = newSelectedArea.startRowIdx - (focusedCell.rowSpan ?? 1);
    } else if (side === "top") {
      if (isPreviouslySelectedArea) {
        newSelectedArea.endRowIdx =
          newSelectedArea.endRowIdx + (previouslySelectedArea.endRowIdx - previouslySelectedArea.startRowIdx);
      } else newSelectedArea.endRowIdx = newSelectedArea.endRowIdx + (focusedCell.rowSpan ?? 1);
    } else if (side === "right") {
      if (isPreviouslySelectedArea) {
        newSelectedArea.startColIdx =
          newSelectedArea.startColIdx - (previouslySelectedArea.endColIdx - previouslySelectedArea.startColIdx);
      } else newSelectedArea.startColIdx = newSelectedArea.startColIdx - (focusedCell.colSpan ?? 1);
    } else if (side === "left") {
      if (isPreviouslySelectedArea) {
        newSelectedArea.endColIdx =
          newSelectedArea.endColIdx + (previouslySelectedArea.endColIdx - previouslySelectedArea.startColIdx);
      } else newSelectedArea.endColIdx = newSelectedArea.endColIdx + (focusedCell.colSpan ?? 1);
    }

    return {
      ...store,
      selectedArea: newSelectedArea,
      fillHandleArea: {
        startRowIdx: -1,
        endRowIdx: -1,
        startColIdx: -1,
        endColIdx: -1,
      },
      currentBehavior: store.getBehavior("Default"),
    };
  },
};
