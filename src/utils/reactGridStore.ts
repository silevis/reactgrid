import { StoreApi, create, createStore, useStore } from "zustand";
import { IndexedLocation } from "../types/InternalModel";
import { CellMap, Column, Row } from "../types/PublicModel";

export interface ReactGridStore {
  rows: Row[];
  readonly setRows: (rows: Row[]) => void;
  columns: Column[];
  readonly setColumns: (columns: Column[]) => void;
  cells: CellMap;
  readonly setCells: (cellMap: CellMap) => void;

  focusedCell: IndexedLocation;
  readonly setFocusedCell: (rowIndex: number, colIndex: number) => void;

  currentlyEditedCell: IndexedLocation;
  readonly setCurrentlyEditedCell: (rowIndex: number, colIndex: number) => void;

  reactGridRef?: HTMLDivElement;
  assignReactGridRef: (reactGridRef?: HTMLDivElement) => void;
  // scrollableRef?: HTMLElement | (Window & typeof globalThis);
  // readonly assignRefs: (
  //   reactGridRef?: HTMLDivElement,
  //   scrollableRef?: HTMLElement | (Window & typeof globalThis)
  // ) => void;

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
        columns: [],
        setColumns: (columns) => set(() => ({ columns })),
        cells: new Map(),
        setCells: (cells) => set(() => ({ cells })),

        focusedCell: { rowIndex: -1, colIndex: -1 },
        setFocusedCell: (rowIndex, colIndex) => set(() => ({ focusedCell: { rowIndex, colIndex } })),

        currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
        setCurrentlyEditedCell: (rowIndex, colIndex) => set(() => ({ currentlyEditedCell: { rowIndex, colIndex } })),

        reactGridRef: undefined,
        assignReactGridRef: (reactGridRef) => set(() => ({ reactGridRef })),
      })),
    };
  });

  const selectedStore = useStore(reactGridStores, (state) => state[id]);
  window.store = selectedStore;
  return useStore(selectedStore, selector);
}
