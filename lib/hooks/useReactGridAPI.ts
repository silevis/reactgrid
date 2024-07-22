import { EMPTY_AREA } from "../types/InternalModel.ts";
import { Location, Range } from "../types/PublicModel.ts";
import { areAreasEqual } from "../utils/areAreasEqual.ts";
import { getNumericalRange } from "../utils/getNumericalRange.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { useReactGridStoreApi } from "../utils/reactGridStore.ts";

/**
 * Hook that provides access to the ReactGrid API.
 * @param id - The ID of the ReactGrid instance.
 * @returns An object containing setters and getters for interacting with the ReactGrid.
 */

const devEnvironment = isDevEnvironment();

export function useReactGridAPI(id: string) {
  return useReactGridStoreApi(id, (store: ReactGridStore) => {
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

      /**
       * Set the selected columns in the ReactGrid.
       * @param startColId
       * @param endColId
       */
      setSelectedColumns: (startColId: string, endColId: string) => {
        const startColIndex = store.columns.findIndex((col) => col.id === startColId);
        const endColIndex = store.columns.findIndex((col) => col.id === endColId);

        return store.setSelectedColumns(startColIndex, endColIndex);
      },

      /**
       * Set selected rows in the ReactGrid.
       * @param startRowId
       * @param endRowId
       */
      setSelectedRows: (startRowId: string, endRowId: string) => {
        const startRowIndex = store.rows.findIndex((row) => row.id === startRowId);
        const endRowIndex = store.columns.findIndex((row) => row.id === endRowId);

        return store.setSelectedRows(startRowIndex, endRowIndex);
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
