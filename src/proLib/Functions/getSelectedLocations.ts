import { ProState } from "../Model/ProState";
import { CellLocation } from "../../core";

export function getSelectedLocations(state: ProState): Array<CellLocation[]> {
  return state.selectedRanges.map((selectedRange) => {
    return selectedRange.rows.flatMap((row) => {
      return selectedRange.columns.map<CellLocation>((col) => ({
        columnId: col.columnId,
        rowId: row.rowId,
      }));
    });
  });
}
