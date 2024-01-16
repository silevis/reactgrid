import { Direction } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { getCellContainer, getStickyAdjacentToCenterPane } from "./cellUtils";
import { isCollision } from "./collisionUtils";
import { isInViewport } from "./isInViewport";
import { ReactGridStore } from "./reactGridStore";
import { getScrollableParent } from "./scrollHelpers";

export function handleJumpScroll(store: ReactGridStore, previousCell: Cell, nextCell: Cell): void {
  // * If nextCell is not fully visible, scroll it into view (! not by using function with similar name!)

  if (!previousCell) return;
  const nextCellContainer = getCellContainer(store, nextCell) as HTMLElement;
  if (!nextCellContainer) return;
  const previousCellContainer = getCellContainer(store, previousCell) as HTMLElement;

  const scrollableParent = (getScrollableParent(nextCellContainer, true) as Element) ?? store.reactGridRef!;
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

  const borderStickyCell = getStickyAdjacentToCenterPane(store, nextCell, scrollingDirection);
  if (!borderStickyCell) throw new Error(`borderStickyCell is ${borderStickyCell}!`);
  const borderStickyContainer = getCellContainer(store, borderStickyCell) as HTMLElement;

  const isNextCellFullyVisible =
    isInViewport(nextCellContainer, scrollableParent) && !isCollision(nextCellContainer, borderStickyContainer);
  const isPreviousCellFullyVisible =
    isInViewport(previousCellContainer, scrollableParent) && !isCollision(previousCellContainer, borderStickyContainer);

  const previousCellRect = previousCellContainer.getBoundingClientRect();
  const nextCellRect = nextCellContainer.getBoundingClientRect();

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
      [directionParameter]: scrollValue,
      behavior: "instant", // ? Maybe add a way to change behavior with the config?
    });
  }
}
