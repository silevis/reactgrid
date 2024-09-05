import { Direction } from "../types/InternalModel.ts";
import { Cell } from "../types/PublicModel.ts";
import { getCellContainer } from "./getCellContainer.ts";
import { getStickyCellAdjacentToCenterPane } from "./getStickyCellAdjacentToCenterPane.ts";
import { isCollision } from "./isCollision.ts";
import { isInViewport } from "./isInViewport.ts";
import { getScrollableParent } from "./scrollHelpers.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";

/**
 * Handles jump scrolling between cells in a ReactGrid.
 * If the next cell is not fully visible and it's not a sticky cell, it scrolls it into view.
 * It tries all four directions ("Right", "Left", "Bottom", "Top") one by one.
 * For each direction, it checks if there's a sticky cell adjacent to the center pane in that direction.
 * If there is, it checks if the next cell is fully visible and not colliding with the sticky cell.
 * If the next cell is not fully visible and it's not the sticky cell, it calculates the scroll value
 * and scrolls the scrollableParent in the direction to bring the next cell into view.
 *
 * @param store - The ReactGridStore instance.
 * @param previousCell - The previous cell (previously focused cell).
 * @param nextCell - The next cell (the one that we want to scroll to.)
 */
export function handleJumpScroll(store: ReactGridStore, previousCell: Cell, nextCell: Cell): void {
  if (!previousCell) return;
  const nextCellContainer = getCellContainer(store, nextCell);
  const previousCellContainer = getCellContainer(store, previousCell);

  if (!previousCellContainer || !nextCellContainer) return;

  const scrollableParent = (getScrollableParent(nextCellContainer, true) as Element) ?? store.reactGridRef!;
  const directions: Direction[] = ["Right", "Left", "Bottom", "Top"];
  const directionParameters: ("top" | "left")[] = ["left", "left", "top", "top"];

  directions.forEach((scrollingDirection, i) => {
    const borderStickyCell = getStickyCellAdjacentToCenterPane(store, nextCell, scrollingDirection);

    if (!borderStickyCell) return;

    const borderStickyContainer = getCellContainer(store, borderStickyCell);

    if (!borderStickyContainer) return;

    const isNextCellFullyVisible =
      isInViewport(nextCellContainer, scrollableParent) && !isCollision(nextCellContainer, borderStickyContainer);

    const isPreviousCellFullyVisible =
      isInViewport(previousCellContainer, scrollableParent) &&
      !isCollision(previousCellContainer, borderStickyContainer);

    const previousCellRect = previousCellContainer.getBoundingClientRect();
    const nextCellRect = nextCellContainer.getBoundingClientRect();

    const directionParameter = directionParameters[i];

    let scrollValue: number;

    if (!isNextCellFullyVisible && nextCellContainer !== borderStickyContainer) {
      if (!isPreviousCellFullyVisible) {
        scrollValue =
          nextCellRect[directionParameter] -
          previousCellRect[directionParameter] +
          previousCellRect[directionParameter === "top" ? "height" : "width"];
      } else {
        scrollValue = nextCellRect[directionParameter] - previousCellRect[directionParameter];
      }

      scrollableParent.scrollBy({
        [directionParameter]: scrollValue,
        behavior: "instant",
      });
    }
  });
}
