import { createContext, memo, useContext, useMemo } from "react";
import { Cell, CellContextType } from "../types/PublicModel";
import { useReactGridStore } from "../utils/reactGridStore";
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
    const { Template, props } = cell;

    const id = useReactGridId();

    const hiddenFocusTargetRef = useReactGridStore(id, (store) => store.hiddenFocusTargetRef, isFocused);

    const setFocusedLocation = useReactGridStore(id, (store) => store.setFocusedLocation);
    const setFocusedCellByDirection = useReactGridStore(id, (store) => store.setFocusedCellByDirection);

    const children = useMemo(() => <Template {...props} />, [Template, props]);

    return (
      <CellContext.Provider
        value={{
          rowId: rowId,
          colId: colId,
          realRowIndex,
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
          requestFocus: (direction?: Direction) => {
            hiddenFocusTargetRef?.focus({ preventScroll: true });

            if (direction) {
              setFocusedCellByDirection(direction);
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
