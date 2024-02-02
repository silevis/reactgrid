import { PaneName } from "../types/InternalModel";

/**
 * Retrieves the sticky pane direction from the given pane element.
 * @param pane - The pane element.
 * @returns The sticky pane direction, or undefined if not found.
 */

export function getStickyPaneDirection(pane: HTMLElement): PaneName | undefined {
  const direction = [...pane.classList].find((className) => className.includes("rgPane-"))?.replace("rgPane-", "");
  return direction as PaneName;
}
