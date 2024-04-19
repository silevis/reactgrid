import { createContext, memo, useContext, useState } from "react";
import { CellContextType } from "../types/PublicModel";
import { useReactGridStoreApi } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";

interface CellContextProviderProps {
  children: React.ReactNode;
  rowId: string;
  colId: string;
  rowIndex: number;
  colIndex: number;
  realRowIndex: number;
  realColumnIndex: number;
  rowSpan?: number;
  colSpan?: number;
  getCellOffset?: (rowIdx: number, colIdx: number, rowSpan: number, colSpan: number) => React.CSSProperties;
}

export const CellContext = createContext<CellContextType>({
  rowId: "",
  colId: "",
  realRowIndex: -1,
  realColumnIndex: -1,
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

export const CellContextProvider = ({
  rowId,
  colId,
  rowIndex,
  colIndex,
  children,
  realRowIndex,
  realColumnIndex,
  rowSpan,
  colSpan,
  getCellOffset,
}: CellContextProviderProps) => {
  const id = useReactGridId();
  const [isInEditMode, setIsInEditMode] = useState(false);

  const hiddenFocusTargetRef = useReactGridStoreApi(id).getState().hiddenFocusTargetRef;
  const setFocusedLocation = useReactGridStoreApi(id).getState().setFocusedLocation;

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
        },
        setEditMode: (value) => {
          if (value === false) {
            hiddenFocusTargetRef?.focus({ preventScroll: true });
            setIsInEditMode(false);
          } else {
            setIsInEditMode(true);
          }
        },
        requestFocus: () => {
          setFocusedLocation(realRowIndex, realColumnIndex);
        },
      }}
    >
      {children}
    </CellContext.Provider>
  );
};
