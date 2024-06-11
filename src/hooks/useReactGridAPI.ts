import { EMPTY_AREA } from "../types/InternalModel";
import { Location, Range } from "../types/PublicModel";
import { areAreasEqual } from "../utils/areAreasEqual";
import { getNumericalRange } from "../utils/getNumericalRange";
import isDevEnvironment from "../utils/isDevEnvironment";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { useReactGridApi } from "../utils/reactGridStore.ts";

/**
 * Hook that provides access to the ReactGrid API.
 * @param id - The ID of the ReactGrid instance.
 * @returns An object containing setters and getters for interacting with the ReactGrid.
 */

const devEnvironment = isDevEnvironment();

export default function useReactGridAPI(id: string) {
  return useReactGridApi(id, (store: ReactGridStore) => {
    return {
      // Setters

      /**
       * Set the selected area in the ReactGrid.
       * @param range - The id-based range to be selected.
       */
      setSelectedArea: (range: Range) => {
        const numericalRange = getNumericalRange(store, range);

        return store.setSelectedArea(numericalRange);
      },

      /**
       * Set the focused cell in the ReactGrid.
       * @param location - The id-based location of the cell to be focused.
       */
      setFocusedCell: ({ rowId, columnId }: Location) => {
        const cell = store.getCellByIds(rowId, columnId);

        if (devEnvironment && !cell) {
          console.warn(`Cell with rowId "${rowId}" and colId "${columnId}" does not exist.`);
        }

        const rowIndex = store.rows.findIndex((row) => row.id === rowId);
        const colIndex = store.columns.findIndex((col) => col.id === columnId);

        return store.setFocusedLocation(rowIndex, colIndex);
      },

      setSelectedColumns: (startColIdx: number, endColIdx: number) => {
        if (devEnvironment && endColIdx < startColIdx) {
          console.warn("The end column index must be greater than the start column index.");
        }

        if (startColIdx < 0 || endColIdx >= store.columns.length) {
          console.warn("Column index out of bounds");
        }

        return store.setSelectedColumns(startColIdx, endColIdx);
      },

      setSelectedRows: (startRowIdx: number, endRowIdx: number) => {
        if (devEnvironment && endRowIdx < startRowIdx) {
          console.warn("The end row index must be greater than the start row index.");
        }

        if (startRowIdx < 0 || endRowIdx >= store.rows.length) {
          console.warn("Row index out of bounds");
        }

        return store.setSelectedRows(startRowIdx, endRowIdx);
      },

      // Getters

      /**
       * Get the currently focused cell in the ReactGrid.
       * @returns The location of the focused cell.
       */
      getFocusedCell: store.getFocusedCell,

      /**
       * Get the cell at the specified indexes in the ReactGrid.
       * @param rowIndex - The row index of the cell.
       * @param colIndex - The column index of the cell.
       * @returns The cell at the specified indexes.
       */
      getCellByIndexes: store.getCellByIndexes,

      /**
       * Get the cell with the specified IDs in the ReactGrid.
       * @param rowId - The row ID of the cell.
       * @param colId - The column ID of the cell.
       * @returns The cell with the specified IDs.
       */
      getCellByIds: store.getCellByIds,

      /**
       * Get the cell or span member at the specified indexes in the ReactGrid.
       * @param rowIndex - The row index of the cell.
       * @param colIndex - The column index of the cell.
       * @returns The cell or span member at the specified indexes.
       */
      getCellOrSpanMemberByIndexes: store.getCellOrSpanMemberByIndexes,

      /**
       * Get the pane ranges in the ReactGrid.
       * @returns The pane ranges.
       */
      getPaneRanges: () => store.paneRanges,

      /**
       * Get the selected area in the ReactGrid.
       * @returns The selected area.
       */
      getSelectedArea: () => {
        const { selectedArea } = store;

        if (devEnvironment && areAreasEqual(selectedArea, EMPTY_AREA)) console.warn("No area is selected!");

        return selectedArea;
      },
    };
  });
}
