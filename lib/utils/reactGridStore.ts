import { create, createStore, StoreApi, useStore } from "zustand";
import { CellSelectionBehavior } from "../behaviors/CellSelectionBehavior.ts";
import { DefaultBehavior } from "../behaviors/DefaultBehavior.ts";
import { Cell, Range, StyledRange } from "../types/PublicModel.ts";
import { isSpanMember } from "./isSpanMember.ts";
import { ReactGridStore, ReactGridStoreProps } from "../types/ReactGridStore.ts";
import { FillHandleBehavior } from "../behaviors/FillHandleBehavior.ts";
import { ColumnReorderBehavior } from "../behaviors/ColumnReorderBehavior.ts";
import { getHiddenTargetFocusByIdx } from "./getHiddenTargetFocusByIdx.ts";

type ReactGridStores = Record<string, StoreApi<ReactGridStore>>;

export const reactGridStores = create<ReactGridStores>(() => ({}));

const DEFAULT_STORE_PROPS: ReactGridStoreProps = {
  // fields passed by the user
  rows: [],
  columns: [],
  cells: new Map(),
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
  behaviors: {
    Default: DefaultBehavior(),
    CellSelection: CellSelectionBehavior,
    FillHandle: FillHandleBehavior,
    ColumnReorder: ColumnReorderBehavior,
  },
  styledRanges: [],
  onFillHandle: undefined,
  onAreaSelected: undefined,
  onCellFocused: undefined,
  onCut: undefined,
  onPaste: undefined,
  onResizeColumn: undefined,

  // internal state
  rowMeasurements: [],
  colMeasurements: [],
  focusedLocation: { rowIndex: -1, colIndex: -1 },
  selectedArea: { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 },
  fillHandleArea: { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 },
  reactGridRef: undefined,
  hiddenFocusTargetRef: undefined,
  resizingColId: undefined,
  lineOrientation: "vertical",
  linePosition: undefined,
  shadowPosition: undefined,
  shadowSize: undefined,
  pointerStartIdx: { rowIndex: -1, colIndex: -1 }, // used for cell selection behavior
  currentBehavior: DefaultBehavior(),
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
        getColumnById: (columnId) => {
          const column = get().columns.find((col) => col.id === columnId);

          if (!column) throw new Error(`Column with id "${columnId}" doesn't exist!`);

          return column;
        },
        setExternalData: (externalData) => {
          return set(() => ({ ...externalData }));
        },
        getColumnAmount: () => get().columns.length,
        getColumnCells: (columnIdx: number) => {
          const { cells } = get();
          const column = get().columns[columnIdx];

          return Array.from(cells.values()).filter((cell) => {
            if (!isSpanMember(cell)) {
              return cell.colId === column.id;
            }
            return false;
          }) as Cell[];
        },

        setCells: (cells) => set(() => ({ cells })),
        setStyles: (styles) => set(() => ({ styles })),
        getCellByIds: (rowId, colId) => {
          const { cells, getCellByIds } = get();

          const cell = cells.get(`${rowId} ${colId}`);

          if (!cell) return null;

          if (isSpanMember(cell)) {
            return getCellByIds(cell.originRowId, cell.originColId) || null;
          }

          return cell;
        },
        getCellByIndexes: (rowIndex, colIndex) => {
          const { rows, columns, getCellByIds } = get();
          const row = rows[rowIndex];
          const col = columns[colIndex];

          if (!row || !col) return null;

          return getCellByIds(row.id, col.id) || null;
        },
        getCellOrSpanMemberByIndexes: (rowIndex, colIndex) => {
          const { rows, columns, cells } = get();
          const row = rows[rowIndex];
          const col = columns[colIndex];

          if (!row || !col) return null;

          const cell = cells.get(`${row.id} ${col.id}`);

          if (!cell) return null;

          return cell;
        },

        setRowMeasurements: (rowMeasurements) => set(() => ({ rowMeasurements })),

        setColMeasurements: (colMeasurements) => set(() => ({ colMeasurements })),

        setPaneRanges: (paneRanges) => set(() => ({ paneRanges })),

        setFocusedLocation: (rowIndex, colIndex) => {
          getHiddenTargetFocusByIdx(rowIndex, colIndex)?.focus();
          set(() => {
            return { focusedLocation: { rowIndex, colIndex } };
          });
        },

        getFocusedCell: () => {
          const { focusedLocation } = get();
          const cell = get().getCellByIndexes(focusedLocation.rowIndex, focusedLocation.colIndex);

          if (!cell) return null;

          return { ...cell, ...focusedLocation };
        },

        setSelectedArea: (selectedArea) => set(() => ({ selectedArea })),

        setSelectedColumns: (startColIdx: number, endColIdx: number) => {
          const { setSelectedArea } = get();

          setSelectedArea({ startRowIdx: 0, endRowIdx: get().getRowAmount(), startColIdx, endColIdx });
        },

        setSelectedRows: (startRowIdx: number, endRowIdx: number) => {
          const { setSelectedArea } = get();

          setSelectedArea({ startRowIdx, endRowIdx, startColIdx: 0, endColIdx: get().getColumnAmount() });
        },

        setFillHandleArea: (fillHandleArea) => set(() => ({ fillHandleArea })),

        setCurrentBehavior: (currentBehavior) => set(() => ({ currentBehavior })),

        setResizingColId: (resizingColId) => set(() => ({ resizingColId })),

        setLineOrientation: (lineOrientation) => set(() => ({ lineOrientation })),
        setLinePosition: (linePosition) => set(() => ({ linePosition })),

        assignReactGridRef: (reactGridRef) => set(() => ({ reactGridRef })),
        assignHiddenFocusTargetRef: (hiddenFocusTargetRef) => set(() => ({ hiddenFocusTargetRef })),

        setBehaviors: (behaviors) => set(() => ({ ...get().behaviors, ...behaviors })),
        getBehavior: (behaviorId) => {
          const behavior = get().behaviors?.[behaviorId];

          if (!behavior) throw new Error(`Behavior with id "${behaviorId}" doesn't exist!`);

          return behavior;
        },

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
}

export function useReactGridStore<T>(id: string, selector: (store: ReactGridStore) => T): T {
  const store = reactGridStores()[id];

  if (store?.getState() === undefined) {
    throw new Error(`ReactGridStore with id "${id}" doesn't exist!`);
  }

  return useStore(store, selector);
}

export const useReactGridStoreApi = <T>(id: string, selector: (store: ReactGridStore) => T): T | undefined => {
  const selectedStore = useStore(reactGridStores, (state) => state[id]);

  const selectedStoreState = selectedStore?.getState();

  if (selectedStoreState) {
    return selector(selectedStoreState);
  }
};
