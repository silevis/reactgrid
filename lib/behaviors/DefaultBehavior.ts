import { Behavior } from "../types/Behavior.ts";
import { NumericalRange } from "../types/CellMatrix.ts";
import { Cell, Position } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { findMinimalSelectedArea } from "../utils/findMinimalSelectedArea.ts";
import { getCellArea } from "../utils/getCellArea.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { getCellContainerLocation } from "../utils/getCellContainerLocation.ts";
import { handleKeyDown } from "../utils/handleKeyDown.ts";
import { isCellInRange } from "../utils/isCellInRange.ts";
import { getCellPaneOverlap } from "../utils/getCellPaneOverlap.ts";
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
  handlePointerDown: function (event, store): ReactGridStore {
    devEnvironment && console.log("DB/handlePointerDown");

    const cellContainer = getCellContainerFromPoint(event.clientX, event.clientY);

    if (!cellContainer) return store;

    const { rowIndex, colIndex } = getCellContainerLocation(cellContainer);

    getHiddenTargetFocusByIdx(rowIndex, colIndex)?.blur();
    getHiddenTargetFocusByIdx(rowIndex, colIndex)?.focus({ preventScroll: true });

    const scrollableParent = (getScrollableParent(cellContainer, true) as Element) ?? store.reactGridRef!;

    handlePaneOverlap(store, rowIndex, colIndex, scrollableParent);

    return store;
  },

  handleFocus: (event, store) => {
    devEnvironment && console.log("DB/handleFocus");

    const hiddenFocusTarget = document.activeElement;

    if (!hiddenFocusTarget) return store;

    const { rowIndex, colIndex } = getHiddenFocusTargetLocation(hiddenFocusTarget);

    const shouldSelectEntireColumn = rowIndex === 0 && store.enableColumnSelectionOnFirstRow;
    const shouldSelectEntireRow = colIndex === 0 && store.enableRowSelectionOnFirstColumn;

    const focusingCell = store.getCellByIndexes(rowIndex, colIndex);

    if (!focusingCell) return store;

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
    if (focusingCell.isFocusable === false) {
      shouldChangeFocusLocation = false;
    }

    const cellArea = getCellArea(store, focusingCell);

    let newBehavior: Behavior = store.currentBehavior;

    let newSelectedArea: NumericalRange | null = null;

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
    } else {
      newSelectedArea = EMPTY_AREA;
    }

    return {
      ...store,
      ...(shouldChangeFocusLocation && { focusedLocation: { rowIndex, colIndex } }),
      absoluteFocusedLocation: { rowIndex, colIndex },
      ...(newSelectedArea && {
        selectedArea: newSelectedArea,
      }),
      ...(newBehavior.id === RowReorderBehavior.id && { lineOrientation: "horizontal" }),
      currentBehavior: newBehavior,
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

  // TODO: Adjust touch event for row reordering
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

    const cellArea = getCellArea(store, touchedCell);

    let newBehavior: Behavior = store.currentBehavior;

    if (focusedCell && element) {
      const { rowIndex: touchRowIndex, colIndex: touchColIndex } = getCellContainerLocation(element);

      const focusedCellWasTouched = touchRowIndex === focusedCell.rowIndex && touchColIndex === focusedCell.colIndex;

      if (focusedCellWasTouched) {
        newBehavior = store.getBehavior("CellSelection");
      }
    }

    if (shouldSelectEntireRow || shouldSelectEntireColumn) {
      newBehavior = store.getBehavior("CellSelection");
    }

    let newSelectedArea: NumericalRange | null = null;

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

    return {
      ...store,
      ...(newSelectedArea && { selectedArea: newSelectedArea }),
      ...(newBehavior.id === RowReorderBehavior.id && { lineOrientation: "horizontal" }),
      currentBehavior: newBehavior,
    };
  },

  handlePointerMoveTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerMoveTouch");

    return store;
  },

  handlePointerUpTouch: function (event, store) {
    devEnvironment && console.log("DB/handlePointerUpTouch");

    const { clientX, clientY } = event;

    touchEndPosition = { x: clientX, y: clientY };

    const element = getCellContainerFromPoint(event.clientX, event.clientY);

    if (!element) return store;

    const { rowIndex, colIndex } = getCellContainerLocation(element);

    const focusedCell = store.getCellByIndexes(rowIndex, colIndex);

    const scrollableParent = (getScrollableParent(element, true) as Element) ?? store.reactGridRef!;

    const leftPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Left");
    const rightPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Right");
    const topPaneOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Top");
    const bottomOverlapValue = getCellPaneOverlap(store, { rowIndex, colIndex }, "Bottom");

    if (leftPaneOverlapValue) {
      scrollableParent?.scrollBy({
        left: -leftPaneOverlapValue,
      });
    }

    if (rightPaneOverlapValue) {
      scrollableParent?.scrollBy({
        left: rightPaneOverlapValue,
      });
    }

    if (topPaneOverlapValue) {
      scrollableParent?.scrollBy({
        top: -topPaneOverlapValue,
      });
    }

    if (bottomOverlapValue) {
      scrollableParent?.scrollBy({
        top: bottomOverlapValue,
      });
    }

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
    console.log("DB/handleCopy");

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
    console.log("DB/handleCut");

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
    console.log("DB/handlePaste");

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
