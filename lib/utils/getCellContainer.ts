import { Cell } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { getCellIndexes } from "./getCellIndexes.1.ts";

export function getCellContainer(store: ReactGridStore, cell: Cell) {
  if (!store.reactGridRef) return;

  const cellIdx = getCellIndexes(store, cell);

  const cellContainers = store.reactGridRef?.getElementsByClassName(
    `rgRowIdx-${cellIdx.rowIndex} rgColIdx-${cellIdx.colIndex}`
  );

  if (!cellContainers || cellContainers?.length === 0) return;
  if (cellContainers?.length !== 1) throw new Error("Cell container is not unique!");

  return cellContainers[0] as HTMLElement;
}
