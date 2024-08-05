import { SpanMember } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "./getCellArea";

// Utility function to check if a row has a spanned cell
export const checkRowHasSpannedCell = (store: ReactGridStore, rowIndex: number): SpanMember | undefined => {
  for (let colIndex = 0; colIndex < store.cells[rowIndex].length; colIndex++) {
    const cell = store.cells[rowIndex][colIndex];
    const cellArea = getCellArea(store, cell);

    if ("originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1 && rowIndex !== cell.originRowIndex) {
      return cell;
    }
  }
};
