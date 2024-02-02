import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "./reactGridStore";


export function getCellContainer(store: ReactGridStore, cell: Cell) {
  if (!store.reactGridRef) throw new Error("ReactGridRef is not defined!");

  const cellContainers = store.reactGridRef?.getElementsByClassName(`rgRowIdx-${cell.rowId} rgColIdx-${cell.colId}`);

  if (!cellContainers || cellContainers?.length === 0) return;
  if (cellContainers?.length !== 1) throw new Error("Cell container is not unique!");

  const cellElement = cellContainers[0];

  return cellElement;
}
