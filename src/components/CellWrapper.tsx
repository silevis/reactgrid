import React, { FC, createContext, useCallback, useContext, useEffect } from "react";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";
import { CellContextType } from "../types/PublicModel";

interface CellWrapperProps
  extends Omit<CellContextType, "requestFocus" | "disableEditMode" | "assignRefs"> {
  children: React.ReactNode;
}

export const CellContext = createContext<CellContextType>({
  rowId: "",
  colId: "",
  realRowIndex: -1,
  realColumnIndex: -1,
  requestFocus: function (enableEditMode: boolean): void {
    throw new Error("Function not implemented.");
  },
  disableEditMode: function (): void {
    throw new Error("Function not implemented.");
  },
  isInEditMode: false,
  isFocused: false,
  getContainerStyle: function (): React.CSSProperties {
    throw new Error("Function not implemented.");
  },
  assignRefs: function (container: HTMLElement | null, input: HTMLElement | null): void {
    throw new Error("Function not implemented.");
  }
});

// export const useCellContext = () => useContext(CellContext);

interface UseCellContextProps {
  /** Cell's container ref, must target the outermost element, adds css classes and modifies style (gridRow[Start/End], gridColumn[Start/End], top, right, bottom, left) */
  containerRef: React.RefObject<HTMLElement>;
  /** Cell's target input ref, must be set on the desired input */
  targetInputRef: React.RefObject<HTMLElement>;
}

export const useCellContext = ({
  containerRef,
  targetInputRef
}: UseCellContextProps) => {
  const ctx = useContext(CellContext);

  if (!ctx) {
    throw new Error("CellContext is unavailable! Did you use this hook outside of ReactGrid's CellWrapper?");
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add("rgCellContainer", `rgRowIdx-${ctx.realRowIndex}`, `rgColIdx-${ctx.realColumnIndex}`);

      ctx.rowSpan && containerRef.current.style.setProperty("grid-row-end", `span ${ctx.rowSpan}`);
      ctx.colSpan && containerRef.current.style.setProperty("grid-column-end", `span ${ctx.colSpan}`);

      const { top, right, bottom, left, ...rest } = ctx.getContainerStyle();
      Object.assign(containerRef.current.style, rest);
      top && containerRef.current.style.setProperty("top", `${top}px`);
      right && containerRef.current.style.setProperty("right", `${right}px`);
      bottom && containerRef.current.style.setProperty("bottom", `${bottom}px`);
      left && containerRef.current.style.setProperty("left", `${left}px`);

      if (targetInputRef.current) {
        targetInputRef.current.classList.add("rgCellInput", `rgRowId-${ctx.rowId}`, `rgColId-${ctx.colId}`);
      }

      ctx.assignRefs(containerRef.current, targetInputRef.current);
    }

  }, [containerRef, targetInputRef, ctx])
  
  return ctx;
}

export const CellWrapper: FC<CellWrapperProps> = ({
  rowId,
  colId,
  realRowIndex,
  realColumnIndex,
  rowSpan,
  colSpan,
  getContainerStyle,
  isFocused,
  isInEditMode,
  children,
}) => {
  const id = useReactGridId();

  const setFocusedLocation = useReactGridStore(id, (store) => store.setFocusedLocation);
  const setCurrentlyEditedCell = useReactGridStore(id, (store) => store.setCurrentlyEditedCell);
  
  const disableEditMode = useCallback(() => setCurrentlyEditedCell(-1, -1), []);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const targetInputRef = React.useRef<HTMLElement | null>(null);

  const assignRefs = useCallback((container: HTMLElement | null, input: HTMLElement | null) => {
    containerRef.current = container;
    targetInputRef.current = input;
  }, []);

  const requestFocus = useCallback(
    (enableEditMode: boolean) => {
      if (enableEditMode) {
        setCurrentlyEditedCell(realRowIndex, realColumnIndex);
      }

      setFocusedLocation(realRowIndex, realColumnIndex);
    },
    [realRowIndex, realColumnIndex]
  );

  return (
    <CellContext.Provider
      value={{
        rowId,
        colId,
        realRowIndex,
        realColumnIndex,
        rowSpan,
        colSpan,
        getContainerStyle,
        disableEditMode,
        requestFocus,
        isInEditMode,
        isFocused,
        assignRefs,
      }}
    >
      {children}
    </CellContext.Provider>
  );
};
