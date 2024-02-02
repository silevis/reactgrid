import { PaneName } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "./reactGridStore";
import { getCellParentPaneName } from "./getCellParentPaneName";
import { getCellIndexes } from "./getCellIndexes.1";

/**
 * Retrieves the sticky cell adjacent to the "Center" pane in the specified direction.
 * @param store The ReactGridStore object.
 * @param cell The position of the sticky cell in the selected direction is counted from this cell.
 * @param direction The direction to search for the sticky cell ("Top", "Bottom", "Right", "Left").
 * @returns The sticky cell adjacent to the center pane, or null if not found.
 */

export function getStickyCellAdjacentToCenterPane(
  store: ReactGridStore,
  cell: Cell,
  direction: "Top" | "Bottom" | "Right" | "Left"
) {
  let stickyCell: Cell | null = null;
  const originIndexes = getCellIndexes(store, cell);

  if (originIndexes.colIndex === -1 || originIndexes.rowIndex === -1) return null;

  let stickyPaneName;
  const cellParentPaneName = getCellParentPaneName(store, cell);
  if (direction === "Top" || direction === "Bottom") {
    stickyPaneName = (direction + cellParentPaneName.replace(/(Top|Bottom)/, "")) as PaneName;
  } else {
    stickyPaneName = direction;
  }

  const paneRange = store.paneRanges[stickyPaneName];
  const startOrEnd = direction === "Bottom" || direction === "Right" ? "start" : "end";

  const isExclusiveRangeIndex = startOrEnd === "end";

  const stickyIndexes = {
    rowIndex: paneRange?.[`${startOrEnd}RowIdx`] - (isExclusiveRangeIndex ? 1 : 0),
    colIndex: paneRange?.[`${startOrEnd}ColIdx`] - (isExclusiveRangeIndex ? 1 : 0),
  };

  if (direction === "Bottom" || direction === "Top") {
    stickyCell = store.getCellByIndexes(stickyIndexes.rowIndex, originIndexes.colIndex) ?? null;
  } else {
    stickyCell = store.getCellByIndexes(originIndexes.rowIndex, stickyIndexes.colIndex) ?? null;
  }

  return stickyCell;
}
