import { getRowAndColumns } from "./getRowAndColumns";
import { getCellPane, getStickyPaneDirection, isCellSticky } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";
import { getContainerFromPoint } from "./getLocationFromClient";
import { getScrollOfScrollableElement, getScrollableParent } from "./scrollHelpers";
import { calcScrollBy } from "./calcScrollBy";
import { get } from "http";
import { getNonStickyCell } from "./getNonStickyCell";
import { createMultiplierFromDistance } from "./createMultiplierFromDistance";

/**
 * Retrieves the grid cell or coordinates (rowIndex, colIndex) based on pointer coordinates.
 * @param {ReactGridStore} store - The ReactGridStore instance.
 * @param {number} clientX - The X-coordinate of the pointer.
 * @param {number} clientY - The Y-coordinate of the pointer.
 * @returns {HTMLElement | { rowIndex: number; colIndex: number }} - Returns either an HTMLElement representing the cell container or an object containing rowIndex and colIndex.
 */

export const getCellFromPointer = (
  store: ReactGridStore,
  clientX: number,
  clientY: number
): { cell: undefined; rowIndex: -1; colIndex: -1 } | { rowIndex: number; colIndex: number } => {
  // Return if no expectations were met
  const defaultReturn = { cell: undefined, rowIndex: -1, colIndex: -1 };
  // Get HTMLElement that contains rendered cell data
  const cellContainer = getContainerFromPoint(clientX, clientY);

  if (!cellContainer) return defaultReturn;

  // Get information about rows and columns from cellContainer
  const rowsAndColumns = getRowAndColumns(cellContainer);

  if (!rowsAndColumns) return defaultReturn;

  const { rowIndex, colIndex } = rowsAndColumns;
  // Get information about cell based on its row and column
  const hoveredCell = store.getCellByIndexes(rowIndex, colIndex);

  if (!hoveredCell) return defaultReturn;

  // If cell is sticky, TRY to find cellContainer under the sticky. If there is no such element, select the sticky.
  if (isCellSticky(store, hoveredCell)) {
    const stickyCell = cellContainer;
    const stickyPane = getCellPane(store, hoveredCell)!;
    // Get the direction of sticky cell pane and scroll in that direction.
    const direction = getStickyPaneDirection(stickyPane)!.toLowerCase();
    const scrollableElement = getScrollableParent(store.reactGridRef!, true);

    const cellUnderTheSticky = getNonStickyCell(store, clientX, clientY);

    const hoveredCellRowsAndColumns = getRowAndColumns(cellUnderTheSticky || stickyCell);
    const { rowIndex: secondCellRowIndex, colIndex: secondCellColIndex } = hoveredCellRowsAndColumns || defaultReturn

    const MIN_SCROLL_SPEED = 8;
    const scrollSpeed = createMultiplierFromDistance(rowIndex, colIndex, secondCellColIndex, secondCellRowIndex)

    const { x, y } = calcScrollBy(direction, MIN_SCROLL_SPEED > scrollSpeed ? MIN_SCROLL_SPEED : scrollSpeed);
    // Scroll by x and y
    scrollableElement?.scrollBy(x, y);

    // If there is no cell under sticky, try to select sticky cell.
    if (!cellUnderTheSticky) {
      if (!rowsAndColumns) return defaultReturn;

      const { rowIndex, colIndex } = rowsAndColumns;
      return { rowIndex, colIndex };
    }

    const stickyCellRowsAndColumns = getRowAndColumns(cellUnderTheSticky);

    if (!stickyCellRowsAndColumns) {

      return defaultReturn;
    } else {

      
      const { rowIndex, colIndex } = stickyCellRowsAndColumns;
      return { rowIndex, colIndex };
    }

  } else {
    return { rowIndex, colIndex };
  }
};


