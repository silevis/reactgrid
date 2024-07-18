import { Behavior } from "../types/Behavior.ts";
import { NumericalRange } from "../types/CellMatrix.ts";
import { Position } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { getCellArea } from "../utils/getCellArea.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { getCellContainerLocation } from "../utils/getCellContainerLocation.ts";
import { handleKeyDown } from "../utils/handleKeyDown.ts";
import { isCellInRange } from "../utils/isCellInRange.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";
import { getScrollableParent } from "../utils/scrollHelpers.ts";
import { ColumnReorderBehavior } from "./ColumnReorderBehavior.ts";
import { RowReorderBehavior } from "./RowReorderBehavior.ts";
import { handlePaneOverlap } from "../utils/handlePaneOverlap.ts";
import { getHiddenTargetFocusByIdx } from "../utils/getHiddenTargetFocusByIdx.ts";
import { EMPTY_AREA } from "../types/InternalModel.ts";
import { selectEntireColumn } from "../utils/selectEntireColumn.ts";
import { selectEntireRow } from "../utils/selectEntireRow.ts";
import { canReorder } from "../utils/canReorder.ts";
import { getHiddenFocusTargetLocation } from "../utils/getHiddenFocusTargetLocation.ts";

const devEnvironment = isDevEnvironment();

type DefaultBehaviorConfig = {
  moveHorizontallyOnEnter: boolean;
};

const CONFIG_DEFAULTS: DefaultBehaviorConfig = {
  moveHorizontallyOnEnter: false,
} as const;

let touchStartPosition: Position | null = null;
let touchEndPosition: Position | null = null;

// TODO: Remove all non-(Pointer/Mouse/Touch)Down handlers to other behaviors (not DefaultBehavior!)
// TODO: handle everything on Pointer BUT check pointerType (mouse/touch)!!!

export const DefaultBehavior = (config: DefaultBehaviorConfig = CONFIG_DEFAULTS): Behavior => ({
  id: "Default",
  handlePointerDown: function (event, store) {
    devEnvironment && console.log("DB/handlePointerDown");

    const cellContainer = getCellContainerFromPoint(event.clientX, event.clientY);
    if (!cellContainer) return store;

    const { rowIndex, colIndex } = getCellContainerLocation(cellContainer);

    const scrollableParent = (getScrollableParent(cellContainer, true) as Element) ?? store.reactGridRef!;
    handlePaneOverlap(store, rowIndex, colIndex, scrollableParent);

    const focusingCell = store.getCellByIndexes(rowIndex, colIndex);
    if (!focusingCell) return store;

    const shouldSelectEntireColumn = rowIndex === 0 && store.enableColumnSelectionOnFirstRow;
    const shouldSelectEntireRow = colIndex === 0 && store.enableRowSelectionOnFirstColumn;
    let shouldChangeFocusLocation: boolean = true;

    if (shouldSelectEntireColumn) {
      if (store.selectedArea.endRowIdx === store.rows.length) {
        // If we already selected the entire column, we should change focus location only if the clicked cell is not in the selected area.
        shouldChangeFocusLocation = !isCellInRange(store, focusingCell, store.selectedArea);
      }
    } else if (shouldSelectEntireRow) {
      if (store.selectedArea.endColIdx === store.columns.length) {
        // If we already selected the entire row, we should change focus location only if the clicked cell is not in the selected area.
        shouldChangeFocusLocation = !isCellInRange(store, focusingCell, store.selectedArea);
      }
    }

    const cellArea = getCellArea(store, focusingCell);
    let newBehavior: Behavior = store.currentBehavior;
    let newSelectedArea: NumericalRange = EMPTY_AREA;

    if (shouldSelectEntireColumn) {
      if (canReorder(store, "column", focusingCell)) {
        newBehavior = ColumnReorderBehavior;
      }
      if (newBehavior.id !== ColumnReorderBehavior.id) {
        newSelectedArea = selectEntireColumn(store, cellArea);
      }
    } else if (shouldSelectEntireRow) {
      if (canReorder(store, "row", focusingCell)) {
        newBehavior = RowReorderBehavior;
      }
      if (newBehavior.id !== RowReorderBehavior.id) {
        newSelectedArea = selectEntireRow(store, cellArea);
      }
    }

    if (shouldChangeFocusLocation) {
      if (focusingCell?.isFocusable !== false) {
        getHiddenTargetFocusByIdx(rowIndex, colIndex)?.focus({ preventScroll: true });
      }

      return {
        selectedArea: newSelectedArea,
      };
    }

    if (newBehavior.id === RowReorderBehavior.id || newBehavior.id === ColumnReorderBehavior.id) {
      return {
        ...(newBehavior.id === RowReorderBehavior.id && { lineOrientation: "horizontal" }),
        currentBehavior: newBehavior,
      };
    }

    return store;
  },

  handleFocus: (event, store) => {
    devEnvironment && console.log("DB/handleFocus");

    const hiddenFocusTarget = document.activeElement;

    if (!hiddenFocusTarget) return store;

    const { rowIndex, colIndex } = getHiddenFocusTargetLocation(hiddenFocusTarget);

    if (rowIndex === -1 || colIndex === -1) return store;

    return {
      focusedLocation: { rowIndex, colIndex },
    };
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("DB/handlePointerMove");

    return { ...store, currentBehavior: store.getBehavior("CellSelection") };
  },

  handlePointerUp: function (event, store) {
    return store;
  },

  handlePointerHold: function (event, store) {
    devEnvironment && console.log("DB/handlePointerHold");
    return store;
  },

  handlePointerHoldTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerHoldTouch");
    return store;
  },

  handleKeyDown: function (event, store) {
    devEnvironment && console.log("DB/handleKeyDown");

    return handleKeyDown(event, store, { moveHorizontallyOnEnter: config.moveHorizontallyOnEnter });
  },

  handlePointerDownTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerDownTouch");

    const { clientX, clientY } = event;

    touchStartPosition = { x: clientX, y: clientY };

    // Disable moving (horizontal & vertical scrolling) if touchStartPosition is the same as focusedCell position.
    const focusedCell = store.getFocusedCell();
    const element = getCellContainerFromPoint(touchStartPosition.x, touchStartPosition.y);

    if (!element) return store;

    const { rowIndex, colIndex } = getCellContainerLocation(element);

    const shouldSelectEntireColumn = rowIndex === 0 && store.enableColumnSelectionOnFirstRow;
    const shouldSelectEntireRow = colIndex === 0 && store.enableRowSelectionOnFirstColumn;

    const touchedCell = store.getCellByIndexes(rowIndex, colIndex);
    if (!touchedCell) return store;

    let newBehavior: Behavior = store.currentBehavior;
    const cellArea = getCellArea(store, touchedCell);
    let newSelectedArea: NumericalRange = EMPTY_AREA;

    if (focusedCell && element) {
      const { rowIndex: touchRowIndex, colIndex: touchColIndex } = getCellContainerLocation(element);

      const focusedCellWasTouched = touchRowIndex === focusedCell.rowIndex && touchColIndex === focusedCell.colIndex;

      if (focusedCellWasTouched) {
        newBehavior = store.getBehavior("CellSelection");
      }
    }

    let shouldChangeFocusLocation: boolean = true;

    if (shouldSelectEntireColumn) {
      if (store.selectedArea.endRowIdx === store.rows.length) {
        // If we already selected the entire column, we should change focus location only if the clicked cell is not in the selected area.
        shouldChangeFocusLocation = !isCellInRange(store, touchedCell, store.selectedArea);
      }
    } else if (shouldSelectEntireRow) {
      if (store.selectedArea.endColIdx === store.columns.length) {
        // If we already selected the entire row, we should change focus location only if the clicked cell is not in the selected area.
        shouldChangeFocusLocation = !isCellInRange(store, touchedCell, store.selectedArea);
      }
    }

    if (shouldSelectEntireColumn) {
      if (canReorder(store, "column", touchedCell)) {
        newBehavior = ColumnReorderBehavior;
      }
      if (newBehavior.id !== ColumnReorderBehavior.id) {
        newSelectedArea = selectEntireColumn(store, cellArea);
      }
    } else if (shouldSelectEntireRow) {
      if (canReorder(store, "row", touchedCell)) {
        newBehavior = RowReorderBehavior;
      }
      if (newBehavior.id !== RowReorderBehavior.id) {
        newSelectedArea = selectEntireRow(store, cellArea);
      }
    }

    if (touchedCell?.isFocusable !== false && shouldChangeFocusLocation) {
      if (shouldSelectEntireColumn || shouldSelectEntireRow) {
        getHiddenTargetFocusByIdx(rowIndex, colIndex)?.focus({ preventScroll: true });
      }

      return {
        selectedArea: newSelectedArea,
      };
    }

    if (newBehavior.id === RowReorderBehavior.id || newBehavior.id === ColumnReorderBehavior.id) {
      return {
        ...(newBehavior.id === RowReorderBehavior.id && { lineOrientation: "horizontal" }),
        currentBehavior: newBehavior,
      };
    }

    return store;
  },

  handlePointerMoveTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerMoveTouch");

    return { ...store, currentBehavior: store.getBehavior("CellSelection") };
  },

  handlePointerUpTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerUpTouch");

    const { clientX, clientY } = event;

    touchEndPosition = { x: clientX, y: clientY };

    const cellContainer = getCellContainerFromPoint(event.clientX, event.clientY);
    if (!cellContainer) return store;

    const { rowIndex, colIndex } = getCellContainerLocation(cellContainer);

    const focusedCell = store.getCellByIndexes(rowIndex, colIndex);

    const scrollableParent = (getScrollableParent(cellContainer, true) as Element) ?? store.reactGridRef!;

    handlePaneOverlap(store, rowIndex, colIndex, scrollableParent);

    if (touchStartPosition && touchEndPosition) {
      const prevElement = getCellContainerFromPoint(touchStartPosition.x, touchStartPosition.y);
      const currElement = getCellContainerFromPoint(touchEndPosition.x, touchEndPosition.y);
      if (prevElement && currElement) {
        const prevCell = getCellContainerLocation(prevElement);
        const currCell = getCellContainerLocation(currElement);

        const shouldSelectEntireColumn = currCell.rowIndex === 0 && store.enableColumnSelectionOnFirstRow;

        if (prevCell.rowIndex === currCell.rowIndex && prevCell.colIndex === currCell.colIndex) {
          if (!shouldSelectEntireColumn && focusedCell?.isFocusable !== false) {
            getHiddenTargetFocusByIdx(rowIndex, colIndex)?.blur();
            getHiddenTargetFocusByIdx(rowIndex, colIndex)?.focus({ preventScroll: true });
          }

          return store;
        }
      }
    }

    return store;
  },

  handleCopy: function (event, store) {
    devEnvironment && console.log("DB/handleCopy");

    const focusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

    if (!focusedCell) return store;

    let cellsArea: NumericalRange;

    if (store.selectedArea.startRowIdx !== -1) {
      cellsArea = store.selectedArea;
    } else {
      cellsArea = getCellArea(store, focusedCell);
    }

    store.onCopy?.(cellsArea);
    return store;
  },

  handleCut: function (event, store) {
    devEnvironment && console.log("DB/handleCut");

    const focusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

    if (!focusedCell) return store;

    let cellsArea: NumericalRange;

    if (store.selectedArea.startRowIdx !== -1) {
      cellsArea = store.selectedArea;
    } else {
      cellsArea = getCellArea(store, focusedCell);
    }

    store.onCut?.(cellsArea);

    return store;
  },

  handlePaste: function (event, store) {
    devEnvironment && console.log("DB/handlePaste");

    const focusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

    if (!focusedCell) return store;

    let cellsArea: NumericalRange;

    if (store.selectedArea.startRowIdx !== -1) {
      cellsArea = store.selectedArea;
    } else {
      cellsArea = getCellArea(store, focusedCell);
    }

    store.onPaste?.(cellsArea, event.clipboardData.getData("text/plain"));

    return store;
  },
});
