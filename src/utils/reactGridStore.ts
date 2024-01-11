import { StoreApi, create, createStore, useStore } from "zustand";
import { CellSelectionBehavior } from "../behaviors/CellSelectionBehavior";
import { DefaultBehavior } from "../behaviors/DefaultBehavior";
import { BehaviorConstructor } from "../types/Behavior";
import { NumericalRange } from "../types/CellMatrix";
import { FocusedCell, IndexedLocation, PaneName } from "../types/InternalModel";
import { Cell, CellMap, Column, Row, SpanMember } from "../types/PublicModel";
import { isSpanMember } from "./cellUtils";
import { RowMeasurement } from "../types/RowMeasurement";
import { ColumnMeasurement } from "../types/ColumnMeasurement";

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
  readonly getCellOrSpanMemberByIndexes: (rowIndex: number, colIndex: number) => Cell | SpanMember | null;

  rowMeasurements: RowMeasurement[];
  readonly setRowMeasurements: (rowMeasurements: RowMeasurement[]) => void;
  colMeasurements: ColumnMeasurement[];
  readonly setColMeasurements: (colMeasurements: ColumnMeasurement[]) => void;

  paneRanges: Record<PaneName, NumericalRange>;
  readonly setPaneRanges: (paneRanges: Record<PaneName, NumericalRange>) => void;

  focusedLocation: IndexedLocation;
  readonly setFocusedLocation: (rowIndex: number, colIndex: number) => void;
  readonly getFocusedCell: () => FocusedCell | null;

  selectedArea: NumericalRange;
  readonly setSelectedArea: (selectedArea: NumericalRange) => void;

  currentlyEditedCell: IndexedLocation;
  readonly setCurrentlyEditedCell: (rowIndex: number, colIndex: number) => void;

  reactGridRef?: HTMLDivElement;
  readonly assignReactGridRef: (reactGridRef?: HTMLDivElement) => void;

  hiddenFocusTargetRef?: HTMLDivElement;
  readonly assignHiddenFocusTargetRef: (hiddenFocusTargetRef?: HTMLDivElement) => void;
  // scrollableRef?: HTMLElement | (Window & typeof globalThis);
  // readonly assignRefs: (
  //   reactGridRef?: HTMLDivElement,
  //   scrollableRef?: HTMLElement | (Window & typeof globalThis)
  // ) => void;

  /* == Behaviors == */
  behaviors: Record<string, BehaviorConstructor>;
  readonly setBehaviors: (behaviors: Record<string, BehaviorConstructor>) => void;
  readonly getBehavior: (behaviorId: string) => BehaviorConstructor;

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
          "TopLeft": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          "TopCenter": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          "TopRight": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          "Left": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          "Center": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          "Right": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          "BottomLeft": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          "BottomCenter": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
          "BottomRight": { startRowIdx: 0, endRowIdx: 0, startColIdx: 0, endColIdx: 0 },
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
          "Default": DefaultBehavior,
          "CellSelection": CellSelectionBehavior,
        },
        setBehaviors: (behaviors) => set(() => ({ ...get().behaviors, ...behaviors })),
        getBehavior: (behaviorId) => {
          const behavior = get().behaviors[behaviorId];

          if (!behavior) throw new Error(`Behavior with id "${behaviorId}" doesn't exist!`);

          return behavior;
        },
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
