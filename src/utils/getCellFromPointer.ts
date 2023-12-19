import { getRowAndColumns } from "./getRowAndColumns";
import { getCellPane, getStickyPaneDirection, isCellSticky } from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";
import { getContainerFromPoint } from "./getLocationFromClient";
import { getScrollOfScrollableElement, getScrollableParent } from "./scrollHelpers";
import { calcScrollBy } from "./calcScrollBy";

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
  const stickyCell = store.getCellByIndexes(rowIndex, colIndex);

  if (!stickyCell) return defaultReturn;

  // If cell is sticky, TRY to find cellContainer under the sticky. If there is no such element, select the sticky.
  if (isCellSticky(store, stickyCell)) {
    const cellUnderTheSticky = document
      .elementsFromPoint(clientX, clientY)
      .find((el) => el.classList.contains("rgCellContainer") && el.classList !== cellContainer.classList); // ! This creates a problem if there is a sticky under another sticky.

    // Get the direction of sticky cell pane and scroll in that direction.
    const stickyPane = getCellPane(store, stickyCell);
    const direction = getStickyPaneDirection(stickyPane)!.toLowerCase();
    const scrollableElement = getScrollableParent(store.reactGridRef!, true);
    const { x, y } = calcScrollBy(direction, 5);
    // Scroll by x and y
    scrollableElement?.scrollBy(x, y);

    console.log(cellUnderTheSticky)

    // If there is no cell under sticky, try to select sticky cell.
    if (!cellUnderTheSticky) {
      if (!rowsAndColumns) return defaultReturn;

      const { rowIndex, colIndex } = rowsAndColumns;
      return { rowIndex, colIndex };
    }

    const stickyCellRowsAndColumns = getRowAndColumns(cellUnderTheSticky);

    if (!stickyCellRowsAndColumns) return defaultReturn;
    const { rowIndex, colIndex } = stickyCellRowsAndColumns;

    return { rowIndex, colIndex };
  } else {
    return { rowIndex, colIndex };
  }
};
