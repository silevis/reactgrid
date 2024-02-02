import { Cell } from "../types/PublicModel";
import { ReactGridStore } from "./reactGridStore";


export function getCellPane(store: ReactGridStore, cell: Cell): HTMLElement {
  const { rowId, colId } = cell;
  const cellContainer = store.reactGridRef?.getElementsByClassName(
    `rgCellContainer rgRowIdx-${rowId} rgColIdx-${colId}`
  );
  if (!cellContainer) throw new Error("No cellContainer found for this cell!");
  if (cellContainer.length !== 1)
    throw new Error("There should be no two cells occupying the same space (simultaneously occupying X and Y)!");
  const pane = cellContainer[0].closest(".rgPane") as HTMLDivElement;

  return pane;
}
