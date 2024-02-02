import { NumericalRange } from "../types/CellMatrix";
import { PaneName } from "../types/InternalModel";
import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "./reactGridStore";
import { isCellInRange } from "./isCellInRange";


export const getCellParentPaneName = (store: ReactGridStore, cell: Cell): PaneName => {
  const PANE_NAME_IDX = 0;
  const PANE_RANGE_IDX = 1;
  const PaneNamesAndRanges = Object.entries(store.paneRanges) as [PaneName, NumericalRange][];

  const parentPane = PaneNamesAndRanges.find((paneNameAndRange) => {
    const paneRange = paneNameAndRange[PANE_RANGE_IDX];
    return isCellInRange(store, cell, paneRange);
  });

  if (!parentPane) throw new Error(`Could not find cell's [rowId: ${cell.rowId}, colId: ${cell.colId}] parent pane!`);

  return parentPane[PANE_NAME_IDX] as PaneName;
};
