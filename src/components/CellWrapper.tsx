import React, { FC, createContext, useState } from "react";
import { CellContext } from "../types/InternalModel";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";

interface CellWrapperProps
  extends Pick<CellContext, "rowId" | "colId" | "realRowIndex" | "realColumnIndex" | "isInEditMode" | "isFocused"> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CellContext = createContext<CellContext>({
  rowId: "",
  colId: "",
  realRowIndex: -1,
  realColumnIndex: -1,
  stringValue: undefined,
  // newValue: undefined,
  setNewValue: function (value: React.SetStateAction<string | undefined>): void {
    throw new Error("Function not implemented.");
  },
  commitNewValueAndBlur: function (): void {
    throw new Error("Function not implemented.");
  },
  discardNewValueAndBlur: function (): void {
    throw new Error("Function not implemented.");
  },
  requestEditMode: function (): void {
    throw new Error("Function not implemented.");
  },
  requestFocus: function (): void {
    throw new Error("Function not implemented.");
  },
  requestBlur: function (): void {
    throw new Error("Function not implemented.");
  },
  isInEditMode: false,
  isFocused: false,
});

export const CellWrapper: FC<CellWrapperProps> = ({
  rowId,
  colId,
  realRowIndex,
  realColumnIndex,
  isFocused,
  isInEditMode,
  className,
  style,
  children,
}) => {
  const id = useReactGridId();
  const attributes = useReactGridStore(id, (store) => store.getCellAttributes(rowId, colId));
  const setAttributes = useReactGridStore(id, (store) => store.setCellAttributes);

  const focusCell = useReactGridStore(id, (store) => store.focusCell);
  const blurCell = useReactGridStore(id, (store) => store.blurCell);
  const setCurrentlyEditedCell = useReactGridStore(id, (store) => store.setCurrentlyEditedCell);

  const [newValue, setNewValue] = useState<string | undefined>(undefined);

  const commitNewValueAndBlur = () => {
    if (newValue === undefined) return;
    setAttributes(rowId, colId, { stringValue: newValue });
    setNewValue(undefined);
    blurCell();
  };

  const discardNewValueAndBlur = () => {
    setNewValue(undefined);
    blurCell();
  };

  return (
    <CellContext.Provider
      value={{
        rowId,
        colId,
        realRowIndex,
        realColumnIndex,
        stringValue: newValue ?? attributes?.stringValue,
        setNewValue,
        commitNewValueAndBlur,
        discardNewValueAndBlur,
        requestEditMode: () => setCurrentlyEditedCell(realRowIndex, realColumnIndex),
        requestFocus: () => focusCell(realRowIndex, realColumnIndex),
        requestBlur: () => blurCell(),
        isInEditMode,
        isFocused
      }}
    >
      <div className={`rgCellWrapper ${className}`} style={{ ...style }}>
        {children}
      </div>
    </CellContext.Provider>
  );
};

export const useCellContext = (): CellContext => React.useContext(CellContext);
