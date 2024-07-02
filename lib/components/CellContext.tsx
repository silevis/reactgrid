import { createContext, memo, useContext, useMemo, useState } from "react";
import { Cell, CellContextType } from "../types/PublicModel";
import { reactGridStores } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";
import { Direction, StickyOffsets } from "../types/InternalModel";

interface CellContextProviderProps {
  rowId: string;
  colId: string;
  rowIndex: number;
  colIndex: number;
  realRowIndex: number;
  realColumnIndex: number;
  cell: Cell<string, string>;
  isFocused: boolean;
  rowSpan?: number;
  colSpan?: number;
  getCellOffset: (rowIdx: number, colIdx: number, rowSpan: number, colSpan: number) => React.CSSProperties;
  stickyOffsets?: StickyOffsets;
  cellStyles?: React.CSSProperties;
}

export const CellContext = createContext<CellContextType>({
  rowId: "",
  colId: "",
  realRowIndex: -1,
  realColumnIndex: -1,
  isFocused: false,
  requestFocus: function (): void {
    throw new Error("Function not implemented.");
  },
  setEditMode: function (): void {
    throw new Error("Function not implemented.");
  },
  isInEditMode: false,
  containerStyle: {},
});

export const useCellContext = () => {
  const ctx = useContext(CellContext);

  if (!ctx) {
    throw new Error("CellContext is unavailable! Did you use this hook outside of ReactGrid's PaneGridRenderer?");
  }

  return ctx;
};

export const CellContextProvider = memo(
  ({
    rowId,
    colId,
    rowIndex,
    colIndex,
    realRowIndex,
    realColumnIndex,
    rowSpan,
    colSpan,
    getCellOffset = () => ({}),
    cell,
    isFocused,
  }: CellContextProviderProps) => {
    const [isInEditMode, setIsInEditMode] = useState(false);

    const { Template, props } = cell;

    const id = useReactGridId();

    // non-reactive way to access store in order to avoid unnecessary re-renders
    const store = reactGridStores()[id].getState();

    const hiddenFocusTargetRef = store.hiddenFocusTargetRef;
    const setFocusedLocation = store.setFocusedLocation;

    const children = useMemo(() => <Template {...props} />, [Template, props]);

    return (
      <CellContext.Provider
        value={{
          rowId: rowId,
          colId: colId,
          realRowIndex,
          isInEditMode,
          realColumnIndex,
          rowSpan: rowSpan,
          colSpan: colSpan,
          isFocused,
          containerStyle: {
            ...(rowSpan && {
              gridRowEnd: `span ${rowSpan}`,
            }),
            ...(colSpan && {
              gridColumnEnd: `span ${colSpan}`,
            }),
            ...getCellOffset?.(rowIndex, colIndex, rowSpan ?? 1, colSpan ?? 1),
            gridRowStart: realRowIndex + 1,
            gridColumnStart: realColumnIndex + 1,
            ...props.style,
          },
          setEditMode: (value) => {
            if (value === false) {
              hiddenFocusTargetRef?.focus({ preventScroll: true });
              setIsInEditMode(false);
            } else {
              setIsInEditMode(true);
            }
          },
          requestFocus: (direction?: Direction) => {
            if (direction) {
              store.setFocusedCellByDirection(direction);
              return;
            }

            setFocusedLocation(realRowIndex, realColumnIndex);
          },
        }}
      >
        {children}
      </CellContext.Provider>
    );
  }
);
