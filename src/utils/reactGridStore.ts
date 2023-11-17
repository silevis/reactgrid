import { StoreApi, create, createStore, useStore } from "zustand";
import { NumericalRange } from "../types/CellMatrix";
import { FocusedCell, IndexedLocation } from "../types/InternalModel";
import { Cell, CellMap, Column, Row } from "../types/PublicModel";

export interface ReactGridStore {
  rows: Row[];
  readonly setRows: (rows: Row[]) => void;
  readonly getRowAmount: () => number;
  columns: Column[];
  readonly setColumns: (columns: Column[]) => void;
  readonly getColumnAmount: () => number;
  cells: CellMap;
  readonly setCells: (cellMap: CellMap) => void;
  readonly getCellByIds: (rowId: ReactGridStore['rows'][number]['id'], colId: ReactGridStore['rows'][number]['id']) => Cell | null;
  readonly getCellByIndexes: (rowIndex: number, colIndex: number) => Cell | null;

  focusedLocation: IndexedLocation;
  readonly setFocusedLocation: (rowIndex: number, colIndex: number) => void;
  readonly getFocusedCell: () => FocusedCell | null;

  currentlyEditedCell: IndexedLocation;
  readonly setCurrentlyEditedCell: (rowIndex: number, colIndex: number) => void;

  reactGridRef?: HTMLDivElement;
  readonly assignReactGridRef: (reactGridRef?: HTMLDivElement) => void;
  // scrollableRef?: HTMLElement | (Window & typeof globalThis);
  // readonly assignRefs: (
  //   reactGridRef?: HTMLDivElement,
  //   scrollableRef?: HTMLElement | (Window & typeof globalThis)
  // ) => void;

  selectedArea: NumericalRange;
  readonly setSelectedArea: (selectedArea: NumericalRange) => void;

  // /* == Callbacks == */
  // onCellChange: NonNullable<ReactGridProps["onCellChange"]>;
  // onFocusLocationChanging: NonNullable<ReactGridProps["onFocusLocationChanging"]>;
  // onFocusLocationChanged: NonNullable<ReactGridProps["onFocusLocationChanged"]>;

  // readonly initializeCallbacks: (props: Pick<NonNullable<ReactGridProps>, 'onCellChange' | 'onFocusLocationChanged' | 'onFocusLocationChanging'>) => void;
}

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
        getCellByIds: (rowId, colId) => get().cells.get(`${rowId} ${colId}`) || null,
        getCellByIndexes: (rowIndex, colIndex) => {
          const row = get().rows[rowIndex];
          const col = get().columns[colIndex];

          if (!row || !col) return null;

          return get().cells.get(`${row.id} ${col.id}`) || null;
        },

        focusedLocation: { rowIndex: -1, colIndex: -1 },
        setFocusedLocation: (rowIndex, colIndex) => set(() => ({ focusedLocation: { rowIndex, colIndex } })),
        getFocusedCell: () => {
          const { focusedLocation } = get();
          const cell = get().getCellByIndexes(focusedLocation.rowIndex, focusedLocation.colIndex);

          if (!cell) return null;

          return { ...cell, ...focusedLocation };
        },

        currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
        setCurrentlyEditedCell: (rowIndex, colIndex) => set(() => ({ currentlyEditedCell: { rowIndex, colIndex } })),

        reactGridRef: undefined,
        assignReactGridRef: (reactGridRef) => set(() => ({ reactGridRef })),

        selectedArea: { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 },
        setSelectedArea: (selectedArea) => set(() => ({ selectedArea })),
      })),
    };
  });

  const selectedStore = useStore(reactGridStores, (state) => state[id]);
  window.store = selectedStore;
  return useStore(selectedStore, selector);
}

export const useReactGridStoreApi = (id: string): StoreApi<ReactGridStore> => {
  const selectedStore = useStore(reactGridStores, (state) => state[id]);
  
  if (!selectedStore) throw new Error(`ReactGridStore with id "${id}" doesn't exist!`);
  
  return selectedStore;
}
