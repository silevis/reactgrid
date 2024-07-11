import { Behavior } from "../types/Behavior.ts";
import { NumericalRange } from "../types/CellMatrix.ts";
import { Position } from "../types/PublicModel.ts";
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

    const element = getCellContainerFromPoint(event.clientX, event.clientY);

    if (!element) return store;

    const { rowIndex, colIndex } = getCellContainerLocation(element);

    const shouldSelectEntireColumn = rowIndex === 0 && store.enableColumnSelectionOnFirstRow;

    const shouldSelectEntireRow = colIndex === 0 && store.enableRowSelectionOnFirstColumn;

    const focusedCell = store.getCellByIndexes(rowIndex, colIndex);

    if (!focusedCell) return store;

    const cellArea = getCellArea(store, focusedCell);

    let newBehavior: Behavior = store.getBehavior("CellSelection") || store.currentBehavior;

    let newSelectedArea = { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 };

    if (shouldSelectEntireColumn) {
      newSelectedArea = findMinimalSelectedArea(store, {
        startRowIdx: 0,
        endRowIdx: store.rows.length,
        startColIdx: cellArea.startColIdx,
        endColIdx: cellArea.endColIdx,
      });

      if (
        isCellInRange(store, focusedCell, store.selectedArea) &&
        store.selectedArea.endRowIdx === store.rows.length &&
        store.onColumnReorder &&
        store.columns[colIndex].reorderable
      ) {
        newBehavior = ColumnReorderBehavior;
      }
    } else if (shouldSelectEntireRow) {
      newSelectedArea = findMinimalSelectedArea(store, {
        startRowIdx: cellArea.startRowIdx,
        endRowIdx: cellArea.endRowIdx,
        startColIdx: 0,
        endColIdx: store.columns.length,
      });

      if (
        isCellInRange(store, focusedCell, store.selectedArea) &&
        store.selectedArea.endColIdx === store.columns.length &&
        store.onRowReorder &&
        store.rows[rowIndex].reorderable
      ) {
        newBehavior = RowReorderBehavior;
      }
    }

    const scrollableParent = (getScrollableParent(element, true) as Element) ?? store.reactGridRef!;

    handlePaneOverlap(store, rowIndex, colIndex, scrollableParent);

    let shouldChangeFocusLocation: boolean = true;

    if (shouldSelectEntireColumn) {
      if (store.selectedArea.endRowIdx === store.rows.length) {
        // If we already selected the entire column, we should change focus location only if the clicked cell is not in the selected area.
        shouldChangeFocusLocation = !isCellInRange(store, focusedCell, store.selectedArea);
      }
    } else if (shouldSelectEntireRow) {
      if (store.selectedArea.endColIdx === store.columns.length) {
        // If we already selected the entire row, we should change focus location only if the clicked cell is not in the selected area.
        shouldChangeFocusLocation = !isCellInRange(store, focusedCell, store.selectedArea);
      }
    }
    if (focusedCell.isFocusable === false) {
      shouldChangeFocusLocation = false;
    }

    return {
      ...store,
      ...(shouldChangeFocusLocation && { focusedLocation: { rowIndex: rowIndex, colIndex: colIndex } }),
      absoluteFocusedLocation: { rowIndex: rowIndex, colIndex: colIndex },
      ...(newBehavior.id !== ColumnReorderBehavior.id &&
        newBehavior.id !== RowReorderBehavior.id && {
          selectedArea: newSelectedArea,
        }),
      ...(newBehavior.id === RowReorderBehavior.id
        ? { lineOrientation: "horizontal" }
        : { lineOrientation: "vertical" }),
      currentBehavior: newBehavior,
    };
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("DB/handlePointerMove");

    return store;
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

    if (
      shouldSelectEntireColumn &&
      isCellInRange(store, touchedCell, store.selectedArea) &&
      store.onColumnReorder &&
      store.columns[colIndex].reorderable
    ) {
      newBehavior = ColumnReorderBehavior;
    }

    if (
      shouldSelectEntireRow &&
      isCellInRange(store, touchedCell, store.selectedArea) &&
      store.selectedArea.endColIdx === store.columns.length &&
      store.onRowReorder &&
      store.rows[rowIndex].reorderable
    ) {
      newBehavior = RowReorderBehavior;
    }

    let selectedArea = { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 };

    if (shouldSelectEntireColumn) {
      selectedArea = findMinimalSelectedArea(store, {
        startRowIdx: 0,
        endRowIdx: store.rows.length,
        startColIdx: cellArea.startColIdx,
        endColIdx: cellArea.endColIdx,
      });
    } else if (shouldSelectEntireRow) {
      selectedArea = findMinimalSelectedArea(store, {
        startRowIdx: cellArea.startRowIdx,
        endRowIdx: cellArea.endRowIdx,
        startColIdx: 0,
        endColIdx: store.columns.length,
      });
    }

    let shouldChangeFocusLocation: boolean = false;

    if (shouldSelectEntireColumn) {
      if (rowIndex === 0 && !isCellInRange(store, touchedCell, store.selectedArea)) {
        shouldChangeFocusLocation = true;
      }
    } else if (shouldSelectEntireRow) {
      if (colIndex === 0) {
        // If we already selected the entire row, we should change focus location only if the clicked cell is not in the selected area.
        if (!isCellInRange(store, touchedCell, store.selectedArea)) {
          shouldChangeFocusLocation = true;

          // Case when we select a row while the entire first column is already selected
        } else if (store.selectedArea.endRowIdx === store.rows.length) {
          shouldChangeFocusLocation = true;
        }
      }
    }
    return {
      ...store,
      ...(shouldChangeFocusLocation && { focusedLocation: { rowIndex: rowIndex, colIndex: colIndex } }),
      absoluteFocusedLocation: { rowIndex: rowIndex, colIndex: colIndex },
      ...(newBehavior.id !== ColumnReorderBehavior.id &&
        newBehavior.id !== RowReorderBehavior.id && { selectedArea: selectedArea }),
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
          return {
            ...store,
            ...(!shouldSelectEntireColumn &&
              focusedCell?.isFocusable !== false && {
                focusedLocation: { rowIndex: currCell.rowIndex, colIndex: currCell.colIndex },
              }),
          };
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
