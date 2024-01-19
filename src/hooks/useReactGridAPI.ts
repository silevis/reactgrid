import { ReactGridStore, useReactGridStore } from "../utils/reactGridStore";

/**
 * Hook that provides access to the ReactGrid API.
 * @param id - The ID of the ReactGrid instance.
 * @returns An object containing setters and getters for interacting with the ReactGrid.
 */
export default function useReactGridAPI(id: string) {
  return useReactGridStore(id, (store: ReactGridStore) => {
    return {
      // Setters

      /**
       * Set the selected area in the ReactGrid.
       * @param area - The selected area.
       */
      setSelectedArea: store.setSelectedArea,

      /**
       * Set the focused cell in the ReactGrid.
       * @param location - The location of the focused cell.
       */
      setFocusedCell: store.setFocusedLocation,

      /**
       * Set the edited cell in the ReactGrid.
       * @param cell - The cell to be edited.
       */
      setEditedCell: store.setCurrentlyEditedCell,

      /**
       * Set the styled ranges in the ReactGrid.
       * @param ranges - The styled ranges.
       */
      setStyledRanges: store.setStyledRanges,

      /**
       * Retrieves styled ranges from the store.
       *
       * @param {NumericalRange} [range] - An optional parameter that specifies a numerical range.
       * If provided, the function will return the styled range that matches this numerical range.
       * If not provided, the function will return all styled ranges.
       *
       * @returns {StyledRange | StyledRange[] | null} The function returns a single `StyledRange` object if a `range` parameter is provided and a match is found.
       * If `range` is not provided, it returns an array of `StyledRange` objects (`StyledRange[]`).
       * If no matches are found in either case, it returns `null`.
       */
      getStyledRanges: store.getStyledRanges,

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
