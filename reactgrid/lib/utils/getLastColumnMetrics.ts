import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";

export const getLastColumnMetrics = (store: ReactGridStore) => {
  const lastColumnCell = store.getCellByIndexes(0, store.columns.length - 1);
  const lastColumnCellContainer = getCellContainer(store, lastColumnCell!);
  const lastColumnCellContainerOffsetLeft = (lastColumnCellContainer as HTMLElement).offsetLeft;
  const lastColumnCellContainerWidth = (lastColumnCellContainer as HTMLElement).offsetWidth;

  return {
    lastColumnRelativeffsetLeft: lastColumnCellContainerOffsetLeft,
    lastColumnClientOffsetLeft: (lastColumnCellContainer as HTMLElement).getBoundingClientRect().left,
    lastColumnCellWidth: lastColumnCellContainerWidth,
  };
};
