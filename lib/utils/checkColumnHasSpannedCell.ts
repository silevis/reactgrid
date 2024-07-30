import { SpanMember } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "./getCellArea";

// Utility function to check if a column has a spanned cell
export const checkColumnHasSpannedCell = (store: ReactGridStore, colIndex: number): SpanMember | undefined => {
  for (let rowIndex = 0; rowIndex < store.cells.length; rowIndex++) {
    const cell = store.cells[rowIndex][colIndex];
    const cellArea = getCellArea(store, cell);
    console.log(cellArea, cell);
    
    if ("originColIndex" in cell && cellArea.endColIdx - cellArea.startColIdx > 1) {
      return cell;
    }
  }
};
