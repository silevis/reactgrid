import { Cell } from "../types/PublicModel";
import {
  getCellPane,
  getStickyPaneDirection
} from "./cellUtils";
import { ReactGridStore } from "./reactGridStore";
import { getScrollableParent } from "./scrollHelpers";
import { createMultiplierFromDistance } from "./createMultiplierFromDistance";
import { calcScrollBy } from "./calcScrollBy";

export function scrollTowardsSticky(
  store: ReactGridStore,
  startingPointCell: Cell,
  stickyCell: { rowIndex: number; colIndex: number; }
): void {
  const stickyPane = getCellPane(store, startingPointCell)!;
  // Get the direction of sticky cell pane and scroll in that direction.
  const direction = getStickyPaneDirection(stickyPane)!.toLowerCase();
  const scrollableElement = getScrollableParent(store.reactGridRef!, true);

  const { rowIndex, colIndex } = store.focusedLocation;

  // Settings for scrolling speed
  const MIN_SCROLL_SPEED = 8;
  const speedMultiplier = createMultiplierFromDistance(rowIndex, colIndex, stickyCell.rowIndex, stickyCell.colIndex);

  const { x, y } = calcScrollBy(direction, MIN_SCROLL_SPEED > speedMultiplier ? MIN_SCROLL_SPEED : speedMultiplier);
  // Scroll by x and y
  scrollableElement?.scrollBy(x, y);
}
