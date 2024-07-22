import { Cell } from "../types/PublicModel.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";

export function getCellPane(store: ReactGridStore, cell: Cell): HTMLElement {
  const cellContainer = store.reactGridRef?.getElementsByClassName(
    `rgCellContainer rgRowIdx-${cell.rowIndex} rgColIdx-${cell.colIndex}`
  );
  if (!cellContainer) throw new Error("No cellContainer found for this cell!");
  if (cellContainer.length !== 1)
    throw new Error("There should be no two cells occupying the same space (simultaneously occupying X and Y)!");

  return cellContainer[0].closest(".rgPane") as HTMLDivElement;
}
