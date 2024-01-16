import { Direction } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { getCellContainer, getStickyAdjacentToCenterPane } from "./cellUtils";
import { isCollision } from "./collisionUtils";
import { isInViewport } from "./isInViewport";
import { ReactGridStore } from "./reactGridStore";
import { getScrollableParent } from "./scrollHelpers";

/**
 * Handles jump scrolling between cells in a ReactGrid.
 * If the next cell is not fully visible, it scrolls it into view.
 *
 * @param store - The ReactGridStore instance.
 * @param previousCell - The previous cell (previously focused cell).
 * @param nextCell - The next cell (the one that we want to scroll to.)
 */
export function handleJumpScroll(store: ReactGridStore, previousCell: Cell, nextCell: Cell): void {
  // * If nextCell is not fully visible, scroll it into view (! not by using function with similar name!)

  if (!previousCell) return;
  const nextCellContainer = getCellContainer(store, nextCell) as HTMLElement;
  if (!nextCellContainer) return; // if there is no nextCellContainer, there is no need to handle scroll
  const previousCellContainer = getCellContainer(store, previousCell) as HTMLElement;

  const scrollableParent = (getScrollableParent(nextCellContainer, true) as Element) ?? store.reactGridRef!; // get container that has scroll
  let scrollingDirection: Direction;

  const nextCellRowIndex = store.rows.findIndex((row) => row.id === nextCell.rowId);
  const previousCellRowIndex = store.rows.findIndex((row) => row.id === previousCell.rowId);

  if (nextCellRowIndex === previousCellRowIndex) {
    const nextCellColIndex = store.columns.findIndex((col) => col.id === nextCell.colId);
    const previousCellColIndex = store.columns.findIndex((col) => col.id === previousCell.colId);
    scrollingDirection = nextCellColIndex > previousCellColIndex ? "Right" : "Left";
  } else {
    scrollingDirection = nextCellRowIndex > previousCellRowIndex ? "Bottom" : "Top";
  }

  // This is cell that is next to center-pane, the first one that is on same row or column that nextCell is
  const borderStickyCell = getStickyAdjacentToCenterPane(store, nextCell, scrollingDirection);
  if (!borderStickyCell) throw new Error(`borderStickyCell is ${borderStickyCell}!`);
  const borderStickyContainer = getCellContainer(store, borderStickyCell) as HTMLElement;

  const isNextCellFullyVisible =
    isInViewport(nextCellContainer, scrollableParent) && !isCollision(nextCellContainer, borderStickyContainer);
  const isPreviousCellFullyVisible =
    isInViewport(previousCellContainer, scrollableParent) && !isCollision(previousCellContainer, borderStickyContainer);

  // Get position and size of both previous and next cell containers (div's)
  const previousCellRect = previousCellContainer.getBoundingClientRect();
  const nextCellRect = nextCellContainer.getBoundingClientRect();

  // Indicates which way the scroll should go to.
  const directionParameter: "top" | "left" =
    scrollingDirection === "Top" || scrollingDirection === "Bottom" ? "top" : "left";

  let scrollValue: number;

  if (!isNextCellFullyVisible) {
    if (!isPreviousCellFullyVisible) {
      scrollValue =
        nextCellRect[directionParameter] -
        previousCellRect[directionParameter] +
        previousCellRect[directionParameter === "top" ? "height" : "width"];
    } else {
      scrollValue = nextCellRect[directionParameter] - previousCellRect[directionParameter];
    }

    scrollableParent.scrollBy({
      // e.g.
      // top: -20px
      [directionParameter]: scrollValue,
      behavior: "instant", // ? Maybe add a way to change behavior with the config?
    });
  }
}
