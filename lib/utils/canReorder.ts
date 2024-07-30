import { Cell } from "../main";
import { ReactGridStore } from "../types/ReactGridStore";
import { isCellInRange } from "./isCellInRange";

export function canReorder(store: ReactGridStore, reorderType: "row" | "column", clickedCell: Cell): boolean {
  switch (reorderType) {
    case "row": {
      return (
        isCellInRange(store, clickedCell, store.selectedArea) &&
        store.selectedArea.endColIdx === store.columns.length &&
        !!store.onRowReorder &&
        !!store.rows[clickedCell.rowIndex].reorderable
      );
    }

    case "column": {
      return (
        isCellInRange(store, clickedCell, store.selectedArea) &&
        store.selectedArea.endRowIdx === store.rows.length &&
        !!store.onColumnReorder &&
        !!store.columns[clickedCell.colIndex].reorderable
      );
    }
  }
}
