import { Cell } from "../types/PublicModel";
import {
  getCellPane,
  getStickyPaneDirection
} from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";
import { getScrollableParent } from "./scrollHelpers";
import { getDistanceBetweenTwoPoints } from "./getDistanceBetweenTwoPoints";
import { calcScrollBy } from "./calcScrollBy";


/**
 * Scrolls towards the sticky cell.
 * @param store The react grid store.
 * @param startingPointCell The cell from which the scroll should start.
 * @param stickyCell The sticky cell to scroll towards.
 */

export function scrollTowardsSticky(
  store: ReactGridStore,
  startingPointCell: Cell,
  stickyCell: { rowIndex: number; colIndex: number; }
): void {
  const stickyPane = getCellPane(store, startingPointCell)!;
  // Get the direction of sticky cell pane and scroll in that direction.
  const direction = getStickyPaneDirection(stickyPane)!;
  const scrollableElement = getScrollableParent(store.reactGridRef!, true);

  const { rowIndex, colIndex } = store.focusedLocation;

  // Settings for scrolling speed
  const MIN_SCROLL_SPEED = 8;
  const speedMultiplier = getDistanceBetweenTwoPoints(rowIndex, colIndex, stickyCell.rowIndex, stickyCell.colIndex);

  const { x, y } = calcScrollBy(direction, MIN_SCROLL_SPEED > speedMultiplier ? MIN_SCROLL_SPEED : speedMultiplier);
  // Scroll by x and y
  scrollableElement?.scrollBy(x, y);
}
