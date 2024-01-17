import { useReactGridStore } from "../utils/reactGridStore";

/**
 * Hook that provides access to the ReactGrid API.
 * @param id - The ID of the ReactGrid instance.
 * @returns An object containing setters and getters for interacting with the ReactGrid.
 */
export default function useReactGridAPI(id: string) {
  return useReactGridStore(id, (store) => {
    return {
      // Setters
      setSelectedArea: store.setSelectedArea,
      setFocusedCell: store.setFocusedLocation,
      setEditedCell: store.setCurrentlyEditedCell,

      // Getters
      getFocusedCell: store.getFocusedCell,
      getCellByIndexes: store.getCellByIndexes,
      getCellByIds: store.getCellByIds,
      getCellOrSpanMemberByIndexes: store.getCellOrSpanMemberByIndexes,
      getEditedCell: () => store.currentlyEditedCell,
      getPaneRanges: () => store.paneRanges,
      getSelectedArea: () => store.selectedArea,
    };
  });
}
