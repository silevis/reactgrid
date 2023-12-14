import React, { CSSProperties, FC } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { GetCellOffsets, PaneName } from "../types/InternalModel";
import { Border, Offset } from "../types/Theme";
import { useTheme } from "../utils/useTheme";

interface PartialAreaProps {
  /** The range of cells to area. */
  areaRange: NumericalRange;
  /** The name of the parent pane (e.g. "TopLeft", "BottomRight"). */
  parentPaneName: PaneName;
  /** The range of cells in the parent pane. */
  parentPaneRange: NumericalRange;
  /** A function that returns the offset of a cell relative to the grid. */
  border?: Border;
  /** A function that returns the offset of a cell relative to the grid. */
  getCellOffset?: GetCellOffsets;
  /** Additional styles to apply to the area. */
  style?: React.CSSProperties;
  /** Additional class names to apply to the area. */
  className?: string;
}

const shouldMemoPartialArea = (prevProps: PartialAreaProps, nextProps: PartialAreaProps) => {
  const {
    startRowIdx: prevStartRowIdx,
    endRowIdx: prevEndRowIdx,
    startColIdx: prevStartColIdx,
    endColIdx: prevEndColIdx,
  } = prevProps.areaRange;

  const {
    startRowIdx: nextStartRowIdx,
    endRowIdx: nextEndRowIdx,
    startColIdx: nextStartColIdx,
    endColIdx: nextEndColIdx,
  } = nextProps.areaRange;

  if (
    prevStartRowIdx !== nextStartRowIdx ||
    prevEndRowIdx !== nextEndRowIdx ||
    prevStartColIdx !== nextStartColIdx ||
    prevEndColIdx !== nextEndColIdx ||
    prevProps.getCellOffset !== nextProps.getCellOffset
  ) {
    return false;
  }

  return true;
}

/**
 * Renders a partial area over a grid pane.
 * @param areaRange - The range of cells to area.
 * @param parentPaneName - The name of the parent pane (e.g. "TopLeft", "BottomRight").
 * @param parentPaneRange - The range of cells in the parent pane.
 * @param getCellOffset - A function that returns the offset of a cell relative to the grid.
 * @param border - The border style of the area.
 * @param style - Additional styles to apply to the area.
 * @param className - Additional class names to apply to the area.
 * @returns A React component that renders the partial area.
 */
export const PartialArea: FC<PartialAreaProps> = React.memo(({ areaRange, parentPaneName, parentPaneRange, getCellOffset, border, style, className }) => {
  const theme = useTheme();
  const offset: Offset = {};
  const areaBorder = border ?? theme.area.border;

  if (areaRange.startRowIdx < 0 || areaRange.startColIdx < 0 || areaRange.endRowIdx < 0 || areaRange.endColIdx < 0) return null;

  if (areaRange.startRowIdx > areaRange.endRowIdx) throw new Error("Invalid range! Start row index is greater than end row index!");
  if (areaRange.startColIdx > areaRange.endColIdx) throw new Error("Invalid range! Start column index is greater than end column index!");

  // Area is outside of parent range
  if (areaRange.startColIdx >= parentPaneRange.endColIdx) return null;
  if (areaRange.startRowIdx >= parentPaneRange.endRowIdx) return null;
  if (areaRange.endColIdx <= parentPaneRange.startColIdx) return null;
  if (areaRange.endRowIdx <= parentPaneRange.startRowIdx) return null;

  const shouldRenderTopBorder = areaRange.startRowIdx >= parentPaneRange.startRowIdx;
  const shouldRenderRightBorder = areaRange.endColIdx <= parentPaneRange.endColIdx;
  const shouldRenderBottomBorder = areaRange.endRowIdx <= parentPaneRange.endRowIdx;
  const shouldRenderLeftBorder = areaRange.startColIdx >= parentPaneRange.startColIdx;

  let width = "100%";
  let height = "100%";

  // If the area part only renders one border (e.g. top border), we need to subtract the border width from the height/width
  if (shouldRenderTopBorder || shouldRenderBottomBorder) height = `calc(100% - ${areaBorder.width})`;
  if (shouldRenderLeftBorder || shouldRenderRightBorder) width = `calc(100% - ${areaBorder.width})`;

  // If the area part renders two borders (e.g. top and bottom border), we need to subtract the border width * 2 from the height/width
  if (shouldRenderTopBorder && shouldRenderBottomBorder) height = `calc(100% - ${areaBorder.width} * 2)`;
  if (shouldRenderLeftBorder && shouldRenderRightBorder) width = `calc(100% - ${areaBorder.width} * 2)`;

  const baseStyle: CSSProperties = {
    borderTop: shouldRenderTopBorder ? `${areaBorder.width} ${areaBorder.style} ${areaBorder.color}` : "none",
    borderRight: shouldRenderRightBorder ? `${areaBorder.width} ${areaBorder.style} ${areaBorder.color}` : "none",
    borderBottom: shouldRenderBottomBorder ? `${areaBorder.width} ${areaBorder.style} ${areaBorder.color}` : "none",
    borderLeft: shouldRenderLeftBorder ? `${areaBorder.width} ${areaBorder.style} ${areaBorder.color}` : "none",

    gridRowStart: areaRange.startRowIdx < parentPaneRange.startRowIdx ? parentPaneRange.startRowIdx + 1 : areaRange.startRowIdx + 1,
    gridRowEnd: areaRange.endRowIdx > parentPaneRange.endRowIdx ? parentPaneRange.endRowIdx + 1 : areaRange.endRowIdx + 1,

    gridColumnStart: areaRange.startColIdx < parentPaneRange.startColIdx ? parentPaneRange.startColIdx + 1 : areaRange.startColIdx + 1,
    gridColumnEnd: areaRange.endColIdx > parentPaneRange.endColIdx ? parentPaneRange.endColIdx + 1 : areaRange.endColIdx + 1,
  };

  if (parentPaneName === "TopLeft" || parentPaneName === "TopCenter" || parentPaneName === "TopRight") {
    baseStyle.position = "sticky";
    offset.top = getCellOffset?.(areaRange.startRowIdx, areaRange.startColIdx, 1, 1).top;

    // If the area part is on the sticky pane and renders only one border, 
    // we need to adjust the height/width such that the border sticks out a bit (at a length of gap width)
    if (!shouldRenderBottomBorder) height = `calc(100% - (${areaBorder.width} - ${theme.grid.gap.width}))`;
  }
  if (parentPaneName === "TopRight" || parentPaneName === "Right" || parentPaneName === "BottomRight") {
    baseStyle.position = "sticky";
    offset.right = getCellOffset?.(areaRange.startRowIdx, areaRange.endColIdx - parentPaneRange.startColIdx - 1, 1, 1).right;
    
    if (!shouldRenderLeftBorder) width = `calc(100% - (${areaBorder.width} - ${theme.grid.gap.width}))`;
  }
  if (parentPaneName === "BottomLeft" || parentPaneName === "BottomCenter" || parentPaneName === "BottomRight") {
    baseStyle.position = "sticky";
    offset.bottom = getCellOffset?.(areaRange.endRowIdx - parentPaneRange.startRowIdx - 1, areaRange.startColIdx, 1, 1).bottom;
    
    if (!shouldRenderTopBorder) height = `calc(100% - (${areaBorder.width} - ${theme.grid.gap.width}))`;
  }
  if (parentPaneName === "TopLeft" || parentPaneName === "Left" || parentPaneName === "BottomLeft") {
    baseStyle.position = "sticky";
    offset.left = getCellOffset?.(areaRange.startRowIdx, areaRange.startColIdx, 1, 1).left;
    
    if (!shouldRenderRightBorder) width = `calc(100% - (${areaBorder.width} - ${theme.grid.gap.width}))`;
  }

  return (
    <div
      className={`rgPartialArea ${className ?? ""}`}
      style={{
        pointerEvents: "none",
        ...style,
        width,
        height,
        ...offset,
        ...baseStyle,
      }} />
  );
}, shouldMemoPartialArea);
