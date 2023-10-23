import { StoreApi, create, createStore, useStore } from "zustand";
import { CellAttributes, IndexedLocation } from "../types/InternalModel";
import { CellMap, Column, Row } from "../types/PublicModel";

interface ReactGridStore {
  rows: Row[];
  readonly setRows: (rows: Row[]) => void;
  columns: Column[];
  readonly setColumns: (columns: Column[]) => void;
  cells: CellMap;
  readonly setCells: (cellMap: CellMap) => void;
  cellsAttributes: Map<string, CellAttributes>;
  readonly setCellAttributes: (
    // cellId: `${ReactGridStore['rows'][number]['id']} ${ReactGridStore['columns'][number]['id']}`,
    rowId: ReactGridStore["rows"][number]["id"],
    colId: ReactGridStore["columns"][number]["id"],
    attributes: Partial<CellAttributes>
  ) => void;
  readonly getCellAttributes: (
    // cellId: `${ReactGridStore['rows'][number]['id']} ${ReactGridStore['columns'][number]['id']}`
    rowId: ReactGridStore["rows"][number]["id"],
    colId: ReactGridStore["columns"][number]["id"]
  ) => CellAttributes | undefined;

  focusedCell: IndexedLocation;
  readonly focusCell: (rowIndex: number, colIndex: number) => void;
  readonly blurCell: () => void;

  currentlyEditedCell: IndexedLocation;
  readonly setCurrentlyEditedCell: (rowIndex: number, colIndex: number) => void;

  reactGridRef?: HTMLDivElement;
  scrollableRef?: HTMLElement | (Window & typeof globalThis);
  readonly assignRefs: (
    reactGridRef?: HTMLDivElement,
    scrollableRef?: HTMLElement | (Window & typeof globalThis)
  ) => void;
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
        cellsAttributes: new Map(),
        setCellAttributes: (rowId, colId, attributes) =>
          set((state) => {
            const oldAttributes = state.cellsAttributes.get(`${rowId} ${colId}`);
            if (!oldAttributes)
              throw new Error(
                `Cell with coordinates [${rowId}, ${colId}] doesn't exist or it's attributes weren't set!`
              );

            Object.assign(oldAttributes, attributes);
            const newCellsAttributes = new Map(state.cellsAttributes);
            newCellsAttributes.set(`${rowId} ${colId}`, oldAttributes);

            return { cellsAttributes: newCellsAttributes };
          }),
        getCellAttributes: (rowId, colId) => get().cellsAttributes.get(`${rowId} ${colId}`),

        focusedCell: { rowIndex: -1, colIndex: -1 },
        focusCell: (rowIndex, colIndex) => set(() => ({ focusedCell: { rowIndex, colIndex } })),
        blurCell: () =>
          set(() => ({
            focusedCell: { rowIndex: -1, colIndex: -1 },
            currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
          })),

        currentlyEditedCell: { rowIndex: -1, colIndex: -1 },
        setCurrentlyEditedCell: (rowIndex, colIndex) => set(() => ({ currentlyEditedCell: { rowIndex, colIndex } })),

        assignRefs: (reactGridRef, scrollableRef) =>
          set(() => ({
            reactGridRef,
            scrollableRef,
          })),
      })),
    };
  });

  const selectedStore = useStore(reactGridStores, (state) => state[id]);
  window.store = selectedStore;
  return useStore(selectedStore, selector);
}
