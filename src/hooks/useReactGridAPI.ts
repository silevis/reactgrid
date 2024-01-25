import { IndexedLocation } from "../types/InternalModel";
import { Range } from "../types/PublicModel";
import { getNumericalRange } from "../utils/getNumericalRange";
import isDevEnvironment from "../utils/isDevEnvironment";
import { useReactGridStore } from "../utils/reactGridStore";

/**
 * Hook that provides access to the ReactGrid API.
 * @param id - The ID of the ReactGrid instance.
 * @returns An object containing setters and getters for interacting with the ReactGrid.
 */

const isDev = isDevEnvironment();

export default function useReactGridAPI(id: string) {
  return useReactGridStore(id, (store) => {
    return {
      // Setters

      /**
       * Set the selected area in the ReactGrid.
       * @param area - The area to be selected.
       */
      setSelectedArea: (range: Range) => {
        const numericalRange = getNumericalRange(store, range);

        return store.setSelectedArea(numericalRange);
      },

      /**
       * Set the focused cell in the ReactGrid.
       * @param location - The location of the cell to be focused.
       */
      setFocusedCell: (location: IndexedLocation) => {
        const { rowIndex, colIndex } = location;
        if (isDev) {
          if (rowIndex === -1 && colIndex === -1) {
            console.warn(
              "By providing rowIndex and colIndex with both values equal to -1, you basically removed focus."
            );
          } else if (rowIndex < 0 || colIndex < 0 || rowIndex > store.rows.length || colIndex > store.columns.length) {
            console.warn("Focused cell should be within grid boundaries.");
          }
        }

        return store.setFocusedLocation(rowIndex, colIndex);
      },

      /**
       * Set the edited cell in the ReactGrid.
       * @param cell - The cell to be edited.
       */
      setEditedCell: (location: IndexedLocation) => {
        const { rowIndex, colIndex } = location;
        if (
          isDev &&
          (rowIndex < 0 || colIndex < 0 || rowIndex > store.rows.length || colIndex > store.columns.length)
        ) {
          console.warn("Edited cell should be within grid boundaries.");
        }

        return store.setCurrentlyEditedCell(rowIndex, colIndex);
      },

      // Getters

      /**
       * Get the currently focused cell in the ReactGrid.
       * @returns The location of the focused cell.
       */
      getFocusedCell: store.getFocusedCell,

      /**
       * Get the cell at the specified indexes in the ReactGrid.
       * @param indexes - The indexes of the cell.
       * @returns The cell at the specified indexes.
       */
      getCellByIndexes: store.getCellByIndexes,

      /**
       * Get the cell with the specified IDs in the ReactGrid.
       * @param ids - The IDs of the cell.
       * @returns The cell with the specified IDs.
       */
      getCellByIds: store.getCellByIds,

      /**
       * Get the cell or span member at the specified indexes in the ReactGrid.
       * @param indexes - The indexes of the cell or span member.
       * @returns The cell or span member at the specified indexes.
       */
      getCellOrSpanMemberByIndexes: store.getCellOrSpanMemberByIndexes,

      /**
       * Get the currently edited cell in the ReactGrid.
       * @returns The currently edited cell.
       */
      getEditedCell: () => store.currentlyEditedCell,

      /**
       * Get the pane ranges in the ReactGrid.
       * @returns The pane ranges.
       */
      getPaneRanges: () => store.paneRanges,

      /**
       * Get the selected area in the ReactGrid.
       * @returns The selected area.
       */
      getSelectedArea: () => store.selectedArea,
    };
  });
}
