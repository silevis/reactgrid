import { IndexedLocation } from "../types/InternalModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";

export function getCellContainerByIndexes(store: ReactGridStore, cellIdx: IndexedLocation) {
  if (!store.reactGridRef) return;

  const cellContainers = store.reactGridRef?.getElementsByClassName(
    `rgRowIdx-${cellIdx.rowIndex} rgColIdx-${cellIdx.colIndex}`
  );

  if (!cellContainers || cellContainers?.length === 0) return;
  if (cellContainers?.length !== 1) throw new Error("Cell container is not unique!");

  return cellContainers[0] as HTMLElement;
}
