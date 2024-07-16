import { Cell } from "../main";
import { ReactGridStore } from "../types/ReactGridStore";
import { getCellIndexes } from "./getCellIndexes.1";
import { isCellInRange } from "./isCellInRange";

export function canReorder(store: ReactGridStore, reorderType: "row" | "column", clickedCell: Cell): boolean {
  const cellIdx = getCellIndexes(store, clickedCell);

  switch (reorderType) {
    case "row": {
      return (
        isCellInRange(store, clickedCell, store.selectedArea) &&
        store.selectedArea.endColIdx === store.columns.length &&
        !!store.onRowReorder &&
        !!store.rows[cellIdx.rowIndex].reorderable
      );
    }

    case "column": {
      return (
        isCellInRange(store, clickedCell, store.selectedArea) &&
        store.selectedArea.endRowIdx === store.rows.length &&
        !!store.onColumnReorder &&
        !!store.columns[cellIdx.colIndex].reorderable
      );
    }
  }
}
