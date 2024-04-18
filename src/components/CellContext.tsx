import { createContext, useContext } from "react";
import { CellContextType } from "../types/PublicModel";

export const CellContext = createContext<CellContextType>({
  rowId: "",
  colId: "",
  realRowIndex: -1,
  realColumnIndex: -1,
  requestFocus: function (): void {
    throw new Error("Function not implemented.");
  },
  isFocused: false,
  containerStyle: {},
});

export const useCellContext = () => {
  const ctx = useContext(CellContext);

  if (!ctx) {
    throw new Error("CellContext is unavailable! Did you use this hook outside of ReactGrid's PaneGridRenderer?");
  }

  return ctx;
};
