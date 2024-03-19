import { NumericalRange } from "../types/CellMatrix";
import { PaneName } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";

export const getPaneNameByCell = (paneRanges: Record<PaneName, NumericalRange>, cell: Cell): PaneName | null => {
  for (const pane in paneRanges) {
    const range = paneRanges[pane as PaneName];
    if (
      +cell.rowId >= range.startRowIdx &&
      +cell.rowId <= range.endRowIdx &&
      +cell.colId >= range.startColIdx &&
      +cell.colId <= range.endColIdx
    ) {
      return pane as PaneName;
    }
  }

  return null;
};
