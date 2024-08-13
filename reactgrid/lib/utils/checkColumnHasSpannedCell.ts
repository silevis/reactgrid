import { SpanMember } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "./getCellArea";

// Utility function to check if a column has a spanned cell
export const checkColumnHasSpannedCell = (store: ReactGridStore, colIndex: number): SpanMember | undefined => {
  const numRows = store.getRowAmount();

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const cell = store.cells.get(`${rowIndex} ${colIndex}`);
    if (!cell) {
      continue;
    }
    const cellArea = getCellArea(store, cell);

    if ("originColIndex" in cell && cellArea.endColIdx - cellArea.startColIdx > 1 && colIndex !== cell.originColIndex) {
      return cell;
    }
  }
};
