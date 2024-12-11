import isEqual from "lodash.isequal";
import { EMPTY_AREA, SpanMember } from "../types/InternalModel.ts";
import { NumericalRange } from "../types/PublicModel.ts";
import { Cell } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { getCellArea } from "./getCellArea.ts";

export const isCellInRange = (
  store: ReactGridStore,
  cell: Cell | SpanMember | undefined,
  range: NumericalRange
): boolean => {
  if (!cell || isEqual(range, EMPTY_AREA)) {
    return false;
  }

  const cellArea = getCellArea(store, cell);

  return (
    cellArea.startRowIdx >= range.startRowIdx &&
    cellArea.endRowIdx <= range.endRowIdx &&
    cellArea.startColIdx >= range.startColIdx &&
    cellArea.endColIdx <= range.endColIdx
  );
};
