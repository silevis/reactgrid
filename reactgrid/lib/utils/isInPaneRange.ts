import { NumericalRange } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";

/**
 * Adjusts the isInPaneRange function to use a range parameter instead of a cell.
 * This function checks if the given range intersects with any of the pane ranges in the store.
 *
 * @param store The ReactGridStore containing the state of the grid.
 * @param range The numerical range to check.
 * @param panePosition The position of the pane ("Top", "Bottom", "Right", "Left").
 * @returns true if the range intersects with the specified pane range, false otherwise.
 */
export const isInPaneRange = (
  store: ReactGridStore,
  range: NumericalRange,
  panePosition: "Top" | "Bottom" | "Right" | "Left"
): boolean => {
  const checkRangeIntersection = (paneRange: NumericalRange): boolean => {
    return (
      range.startRowIdx >= paneRange.startRowIdx &&
      range.endRowIdx <= paneRange.endRowIdx &&
      range.startColIdx >= paneRange.startColIdx &&
      range.endColIdx <= paneRange.endColIdx
    );
  };

  switch (panePosition) {
    case "Left":
      return (
        checkRangeIntersection(store.paneRanges.TopLeft) ||
        checkRangeIntersection(store.paneRanges.Left) ||
        checkRangeIntersection(store.paneRanges.BottomLeft)
      );
    case "Right":
      return (
        checkRangeIntersection(store.paneRanges.TopRight) ||
        checkRangeIntersection(store.paneRanges.Right) ||
        checkRangeIntersection(store.paneRanges.BottomRight)
      );
    case "Top":
      return (
        checkRangeIntersection(store.paneRanges.TopLeft) ||
        checkRangeIntersection(store.paneRanges.TopCenter) ||
        checkRangeIntersection(store.paneRanges.TopRight)
      );
    case "Bottom":
      return (
        checkRangeIntersection(store.paneRanges.BottomLeft) ||
        checkRangeIntersection(store.paneRanges.BottomCenter) ||
        checkRangeIntersection(store.paneRanges.BottomRight)
      );
    default:
      return false;
  }
};
