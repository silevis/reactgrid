import { Cell } from "../types/PublicModel.ts";
import { getCellPane } from "./getCellPane.ts";
import { getStickyPaneDirection } from "./getStickyPaneDirection.ts";
import { getScrollableParent } from "./scrollHelpers.ts";
import { getDistanceBetweenTwoPoints } from "./getDistanceBetweenTwoPoints.ts";
import { calcScrollBy } from "./calcScrollBy.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";

/**
 * Scrolls towards the sticky cell with options to disable vertical or horizontal scrolling.
 * @param store The react grid store.
 * @param startingPointCell The cell from which the scroll should start.
 * @param stickyCell The sticky cell to scroll towards.
 * @param disableVerticalScroll Optional parameter to disable vertical scrolling.
 * @param disableHorizontalScroll Optional parameter to disable horizontal scrolling.
 */

export function scrollTowardsSticky(
  store: ReactGridStore,
  startingPointCell: Cell,
  stickyCell: { rowIndex: number; colIndex: number },
  disableVerticalScroll: boolean = false,
  disableHorizontalScroll: boolean = false
): void {
  const stickyPane = getCellPane(store, startingPointCell)!;
  // Get the direction of sticky cell pane and scroll in that direction.
  const direction = getStickyPaneDirection(stickyPane)!;
  const scrollableElement = getScrollableParent(store.reactGridRef!, true);

  const { rowIndex, colIndex } = store.focusedLocation;

  // Settings for scrolling speed
  const MIN_SCROLL_SPEED = 8;
  const speedMultiplier = getDistanceBetweenTwoPoints(rowIndex, colIndex, stickyCell.rowIndex, stickyCell.colIndex);

  let { x, y } = calcScrollBy(direction, MIN_SCROLL_SPEED > speedMultiplier ? MIN_SCROLL_SPEED : speedMultiplier);

  // Disable scrolling in specified directions
  if (disableVerticalScroll) y = 0;
  if (disableHorizontalScroll) x = 0;

  // Scroll by x and y, considering disabled directions
  scrollableElement?.scrollBy(x, y);
}
