import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { getCellIndexes } from "./getCellIndexes.1.ts";

export function getCellPane(store: ReactGridStore, cell: Cell): HTMLElement {
  const cellIdx = getCellIndexes(store, cell);

  const cellContainer = store.reactGridRef?.getElementsByClassName(
    `rgCellContainer rgRowIdx-${cellIdx.rowIndex} rgColIdx-${cellIdx.colIndex}`
  );
  if (!cellContainer) throw new Error("No cellContainer found for this cell!");
  if (cellContainer.length !== 1)
    throw new Error("There should be no two cells occupying the same space (simultaneously occupying X and Y)!");

  return cellContainer[0].closest(".rgPane") as HTMLDivElement;
}
