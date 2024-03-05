import { NumericalRange } from "../types/CellMatrix";
import { Cell } from "../types/PublicModel";
import { getCellArea } from "./getCellArea";

export const isCellInRange = (cell: Cell, range: NumericalRange): boolean => {
  const cellArea = getCellArea(cell);

  return (
    cellArea.startRowIdx >= range.startRowIdx &&
    cellArea.endRowIdx <= range.endRowIdx &&
    cellArea.startColIdx >= range.startColIdx &&
    cellArea.endColIdx <= range.endColIdx
  );
};
