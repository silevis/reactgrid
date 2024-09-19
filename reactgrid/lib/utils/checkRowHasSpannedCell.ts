import { SpanMember } from "../types/InternalModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "./getCellArea";

// Utility function to check if a row has a spanned cell
export const checkRowHasSpannedCell = (store: ReactGridStore, rowIndex: number): SpanMember | undefined => {
  const numCols = store.getColumnAmount();

  for (let colIndex = 0; colIndex < numCols; colIndex++) {
    const cell = store.cells.get(`${rowIndex} ${colIndex}`);
    if (!cell) {
      continue;
    }
    const cellArea = getCellArea(store, cell);

    if ("originRowIndex" in cell && cellArea.endRowIdx - cellArea.startRowIdx > 1 && rowIndex !== cell.originRowIndex) {
      return cell;
    }
  }
};
