import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";

export const getLastRowMetrics = (store: ReactGridStore) => {
  const lastRowCell = store.getCellByIndexes(store.rows.length - 1, 0);
  const lastRowCellContainer = getCellContainer(store, lastRowCell!);
  const lastRowCellContainerOffsetTop = (lastRowCellContainer as HTMLElement).offsetTop;
  const lastRowCellContainerHeight = (lastRowCellContainer as HTMLElement).offsetHeight;

  return {
    lastRowRelativeOffsetTop: lastRowCellContainerOffsetTop,
    lastRowClientOffsetTop: (lastRowCellContainer as HTMLElement).getBoundingClientRect().top,
    lastRowHeight: lastRowCellContainerHeight,
  };
};
