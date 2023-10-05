import { StoreApi, create, createStore, useStore } from "zustand";
import { CellMap, Column, ReactGridProps, Row } from "../types/PublicModel";
import {
  CellMatrix,
  GridMeasurements,
  NumericalRange,
} from "../types/CellMatrix";
import { CellAttributes } from "../types/InternalModel";

interface ReactGridStore {
  // props: ReactGridProps;
  // setProps: (props: ReactGridProps) => void;

  rows: Row[];
  setRows: (rows: Row[]) => void;
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  cells: CellMap;
  setCells: (cellMap: CellMap) => void;
  cellsAttributes: Map<string, CellAttributes>;
  setCellsAttributes: (cellsAttributes: Map<string, CellAttributes>) => void;

  measurements: GridMeasurements;
  setMeasurements: (measurements: GridMeasurements) => void;
  visibleRange: NumericalRange;
  setVisibleRange: (visibleRange: NumericalRange) => void;

  reactGridRef?: HTMLDivElement;
  scrollableRef?: HTMLElement | (Window & typeof globalThis);
  assignRefs: (
    reactGridRef?: HTMLDivElement,
    scrollableRef?: HTMLElement | (Window & typeof globalThis)
  ) => void;
}

type ReactGridStores = Record<string, StoreApi<ReactGridStore>>;

const reactGridStores = create<ReactGridStores>(() => ({}));

export function useReactGridStore<T>(
  id: string,
  selector: (store: ReactGridStore) => T
): T {
  reactGridStores.setState((state) => {
    if (state[id]) return state;

    return {
      ...state,
      [id]: createStore<ReactGridStore>((set, get) => ({
        // props: {} as ReactGridProps,
        // setProps: (props: ReactGridProps) => set({ props }),
        // cellMatrix: {
        //   rows: [],
        //   columns: [],
        //   cells: new Map(),
        //   totalHeight: 0,
        //   totalWidth: 0,
        //   stickyAmount: { top: 0, right: 0, bottom: 0, left: 0 },
        // },
        // setCellMatrix: (cellMatrix: CellMatrix) =>
        //   set((state) => ({ cellMatrix })),

        rows: [],
        setRows: (rows: Row[]) => set(() => ({ rows })),
        columns: [],
        setColumns: (columns: Column[]) => set(() => ({ columns })),
        cells: new Map(),
        setCells: (cells: CellMap) => set(() => ({ cells })),
        cellsAttributes: new Map(),
        setCellsAttributes: (cellsAttributes: Map<string, CellAttributes>) =>
          set(() => ({ cellsAttributes })),

        measurements: {
          rows: [],
          columns: [],
          totalHeight: 0,
          totalWidth: 0,
        },
        setMeasurements: (measurements: GridMeasurements) =>
          set((state) => ({ measurements })),

        assignRefs: (
          reactGridRef?: HTMLDivElement,
          scrollableRef?: HTMLElement | (Window & typeof globalThis)
        ) =>
          set((state) => ({
            reactGridRef,
            scrollableRef,
          })),

        visibleRange: {
          startRowIdx: 0,
          endRowIdx: 0,
          startColIdx: 0,
          endColIdx: 0,
        },
        setVisibleRange: (visibleRange: NumericalRange) =>
          set((state) => ({ visibleRange })),
      })),
    };
  });

  const selectedStore = useStore(reactGridStores, (state) => state[id]);
  return useStore(selectedStore, selector);
}
