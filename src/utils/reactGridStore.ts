import { create, createStore, StoreApi, useStore } from "zustand";
import { CellSelectionBehavior } from "../behaviors/CellSelectionBehavior";
import { DefaultBehavior } from "../behaviors/DefaultBehavior";
import { Range, StyledRange } from "../types/PublicModel";
import { isSpanMember } from "./isSpanMember";
import { ReactGridStore, ReactGridStoreProps } from "../types/ReactGridStore.ts";

type ReactGridStores = Record<string, StoreApi<ReactGridStore>>;

const reactGridStores = create<ReactGridStores>(() => ({}));

const DEFAULT_STORE_PROPS: ReactGridStoreProps = {
  rows: [],
  columns: [],
  cells: new Map(),
  rowMeasurements: [],
  colMeasurements: [],
  paneRanges: {
    TopLeft: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
    TopCenter: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
    TopRight: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
    Left: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
    Center: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
    Right: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
    BottomLeft: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
    BottomCenter: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
    BottomRight: { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 }
  },
  styledRanges: [],
  focusedLocation: { rowIndex: 0, colIndex: 0 },
  selectedArea: { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 },
  currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
  reactGridRef: undefined,
  hiddenFocusTargetRef: undefined,
  behaviors: {
    Default: DefaultBehavior(),
    CellSelection: CellSelectionBehavior
  },
  currentBehavior: DefaultBehavior()
};

export function initReactGridStore(id: string, initialProps?: Partial<ReactGridStoreProps>) {
  reactGridStores.setState((state) => {
    if (state[id]) return state;

    return {
      ...state,
      [id]: createStore<ReactGridStore>()((set, get) => ({
        ...DEFAULT_STORE_PROPS,
        ...initialProps,
        behaviors: { ...DEFAULT_STORE_PROPS.behaviors, ...initialProps?.behaviors },
        setRows: (rows) => set(() => ({ rows })),
        getRowAmount: () => get().rows.length,
        setColumns: (columns) => set(() => ({ columns })),
        getColumnAmount: () => get().columns.length,
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

        setRowMeasurements: (rowMeasurements) => set(() => ({ rowMeasurements })),
        setColMeasurements: (colMeasurements) => set(() => ({ colMeasurements })),

        setPaneRanges: (paneRanges) => set(() => ({ paneRanges })),

        setFocusedLocation: (rowIndex, colIndex) => set(() => ({ focusedLocation: { rowIndex, colIndex } })),
        getFocusedCell: () => {
          const { focusedLocation } = get();
          const cell = get().getCellByIndexes(focusedLocation.rowIndex, focusedLocation.colIndex);

          if (!cell) return null;

          return { ...cell, ...focusedLocation };
        },

        setSelectedArea: (selectedArea) => set(() => ({ selectedArea })),

        setCurrentlyEditedCell: (rowIndex, colIndex) => set(() => ({ currentlyEditedCell: { rowIndex, colIndex } })),

        assignReactGridRef: (reactGridRef) => set(() => ({ reactGridRef })),
        assignHiddenFocusTargetRef: (hiddenFocusTargetRef) => set(() => ({ hiddenFocusTargetRef })),

        setBehaviors: (behaviors) => set(() => ({ ...get().behaviors, ...behaviors })),
        getBehavior: (behaviorId) => {
          const behavior = get().behaviors?.[behaviorId];

          if (!behavior) throw new Error(`Behavior with id "${behaviorId}" doesn't exist!`);

          return behavior;
        },

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
        }
      }))
    };
  });
}

export function useReactGridStore<T>(id: string, selector: (store: ReactGridStore) => T): T {
  reactGridStores.setState((state) => {
    if (state[id]) {
      return state;
    } else {
      throw new Error(`ReactGridStore with id "${id}" doesn't exist!`);
    }
  });

  const selectedStore = useStore(reactGridStores, (state) => state[id]);
  return useStore(selectedStore, selector);
}

export const useReactGridStoreApi = (id: string): StoreApi<ReactGridStore> => {
  const selectedStore = useStore(reactGridStores, (state) => state[id]);

  if (!selectedStore) throw new Error(`ReactGridStore with id "${id}" doesn't exist!`);

  return selectedStore;
};
