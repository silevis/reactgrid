import { create, createStore, StoreApi, useStore } from "zustand";
import { CellSelectionBehavior } from "../behaviors/CellSelectionBehavior";
import { DefaultBehavior } from "../behaviors/DefaultBehavior";
import { Range, StyledRange } from "../types/PublicModel";
import { isSpanMember } from "./isSpanMember";
import { ReactGridStore } from "../types/ReactGridStore.ts";

type ReactGridStores = Record<string, StoreApi<ReactGridStore>>;

const reactGridStores = create<ReactGridStores>(() => ({}));

export function useReactGridStore<T>(id: string, selector: (store: ReactGridStore) => T): T {
  reactGridStores.setState((state) => {
    if (state[id]) return state;

    return {
      ...state,
      [id]: createStore<ReactGridStore>((set, get) => ({
        rows: [],
        setRows: (rows) => set(() => ({ rows })),
        getRowAmount: () => get().rows.length,
        columns: [],
        setColumns: (columns) => set(() => ({ columns })),
        getColumnAmount: () => get().columns.length,
        cells: new Map(),
        setCells: (cells) => set(() => ({ cells })),
        getCellByIds: (rowId, colId) => {
          const cell = get().cells.get(`${rowId} ${colId}`);

          if (!cell) return null;

          if (isSpanMember(cell)) {
            return get().getCellByIds(cell.originRowId, cell.originColId) || null;
          }

          return cell;
        },
        getCellByIndexes: (rowIndex, colIndex) => {
          const row = get().rows[rowIndex];
          const col = get().columns[colIndex];

          if (!row || !col) return null;

          return get().getCellByIds(row.id, col.id) || null;
        },
        getCellOrSpanMemberByIndexes: (rowIndex, colIndex) => {
          const row = get().rows[rowIndex];
          const col = get().columns[colIndex];

          if (!row || !col) return null;

          const cell = get().cells.get(`${row.id} ${col.id}`);

          if (!cell) return null;

          return cell;
        },

        rowMeasurements: [],
        setRowMeasurements: (rowMeasurements) => set(() => ({ rowMeasurements })),
        colMeasurements: [],
        setColMeasurements: (colMeasurements) => set(() => ({ colMeasurements })),

        paneRanges: {
          TopLeft: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          TopCenter: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          TopRight: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          Left: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          Center: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          Right: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          BottomLeft: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          BottomCenter: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          BottomRight: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
        },
        setPaneRanges: (paneRanges) => set(() => ({ paneRanges })),

        focusedLocation: { rowIndex: 0, colIndex: 0 },
        setFocusedLocation: (rowIndex, colIndex) => set(() => ({ focusedLocation: { rowIndex, colIndex } })),
        getFocusedCell: () => {
          const { focusedLocation } = get();
          const cell = get().getCellByIndexes(focusedLocation.rowIndex, focusedLocation.colIndex);

          if (!cell) return null;

          return { ...cell, ...focusedLocation };
        },

        selectedArea: { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 },
        setSelectedArea: (selectedArea) => set(() => ({ selectedArea })),

        currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
        setCurrentlyEditedCell: (rowIndex, colIndex) => set(() => ({ currentlyEditedCell: { rowIndex, colIndex } })),

        reactGridRef: undefined,
        assignReactGridRef: (reactGridRef) => set(() => ({ reactGridRef })),

        hiddenFocusTargetRef: undefined,
        assignHiddenFocusTargetRef: (hiddenFocusTargetRef) => set(() => ({ hiddenFocusTargetRef })),

        behaviors: {
          Default: DefaultBehavior(),
          CellSelection: CellSelectionBehavior,
        },
        currentBehavior: get()?.behaviors["Default"] ?? DefaultBehavior(),
        setBehaviors: (behaviors) => set(() => ({ ...get().behaviors, ...behaviors })),
        getBehavior: (behaviorId) => {
          const behavior = get().behaviors[behaviorId];

          if (!behavior) throw new Error(`Behavior with id "${behaviorId}" doesn't exist!`);

          return behavior;
        },

        styledRanges: [],
        setStyledRanges: (styledRanges) => set(() => ({ styledRanges })),

        getStyledRanges: (range?: Range): StyledRange[] | [] => {
          const styledRanges: StyledRange[] = get().styledRanges;
          if (!range) {
            return styledRanges ? styledRanges : [];
          } else {
            const styledRange = styledRanges.find((styledRange) => {
              JSON.stringify(styledRange.range) === JSON.stringify(range);
            });

            return styledRange ? [styledRange] : [];
          }
        },
      })),
    };
  });

  const selectedStore = useStore(reactGridStores, (state) => state[id]);
  return useStore(selectedStore, selector);
}

export const useReactGridStoreApi = (id: string): StoreApi<ReactGridStore> => {
  const selectedStore = useStore(reactGridStores, (state) => state[id]);

  if (!selectedStore) throw new Error(`ReactGridStore with id "${id}" doesn't exist!`);

  return selectedStore;
};
