import { NumericalRange } from "../types/CellMatrix";
import { Cell, SpanMember } from "../types/PublicModel";
import { ReactGridStore } from "./reactGridStore";
import { getCellArea } from "./getCellArea";


export const isCellInRange = (store: ReactGridStore, cell: Cell | SpanMember, range: NumericalRange): boolean => {
  const cellArea = getCellArea(store, cell);

  return (
    cellArea.startRowIdx >= range.startRowIdx &&
    cellArea.endRowIdx <= range.endRowIdx &&
    cellArea.startColIdx >= range.startColIdx &&
    cellArea.endColIdx <= range.endColIdx
  );
};
