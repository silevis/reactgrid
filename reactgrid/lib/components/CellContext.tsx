import { createContext, memo, useContext } from "react";
import { Cell, CellContextType } from "../types/PublicModel";
import { StickyOffsets } from "../types/InternalModel";
import { deepCompare } from "../utils/deepCompare";

interface CellContextProviderProps {
  rowIndex: number;
  colIndex: number;
  realRowIndex: number;
  realColumnIndex: number;
  cell: Cell;
  isSelected: boolean;
  isFocused: boolean;
  rowSpan?: number;
  colSpan?: number;
  getCellOffset: (rowIdx: number, colIdx: number, rowSpan: number, colSpan: number) => React.CSSProperties;
  shouldRenderReorderedCells: boolean;
  stickyOffsets?: StickyOffsets;
  cellStyles?: React.CSSProperties;
}

export const CellContext = createContext<CellContextType>({
  realRowIndex: -1,
  realColumnIndex: -1,
  isSelected: false,
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

export const CellContextProvider = memo(
  ({
    rowIndex,
    colIndex,
    realRowIndex,
    realColumnIndex,
    rowSpan,
    colSpan,
    getCellOffset = () => ({}),
    cell,
    isSelected,
    isFocused,
  }: CellContextProviderProps) => {
    const { Template, props } = cell;

    return (
      <CellContext.Provider
        value={{
          realRowIndex,
          realColumnIndex,
          isSelected,
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
          },
        }}
      >
        <Template {...props} />
      </CellContext.Provider>
    );
  },
  (prev, next) => {
    return (
      !next.shouldRenderReorderedCells &&
      deepCompare(prev.cell, next.cell) &&
      prev.isSelected === next.isSelected &&
      prev.isFocused === next.isFocused &&
      prev.getCellOffset === next.getCellOffset
    );
  }
);
