import React, { CSSProperties, FC } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { GetCellOffsets, PaneName } from "../types/InternalModel";
import { useTheme } from "../utils/useTheme";
import { Border } from "../types/Theme";
import { Offset } from "../types/Theme";

interface PartialHighlightProps {
  /** The range of cells to highlight. */
  highlightRange: NumericalRange;
  /** The name of the parent pane (e.g. "TopLeft", "BottomRight"). */
  parentPaneName: PaneName;
  /** The range of cells in the parent pane. */
  parentPaneRange: NumericalRange;
  /** A function that returns the offset of a cell relative to the grid. */
  border?: Border;
  /** A function that returns the offset of a cell relative to the grid. */
  getCellOffset?: GetCellOffsets;
  /** Additional styles to apply to the highlight. */
  style?: React.CSSProperties;
}

/**
 * Renders a partial highlight over a grid pane.
 * @param highlightRange - The range of cells to highlight.
 * @param parentPaneName - The name of the parent pane (e.g. "TopLeft", "BottomRight").
 * @param parentPaneRange - The range of cells in the parent pane.
 * @param getCellOffset - A function that returns the offset of a cell relative to the grid.
 * @param border - The border style of the highlight.
 * @param style - Additional styles to apply to the highlight.
 * @returns A React component that renders the partial highlight.
 */
export const PartialHighlight: FC<PartialHighlightProps> = ({ highlightRange, parentPaneName, parentPaneRange, getCellOffset, border, style }) => {
  const theme = useTheme();
  const offset: Offset = {};
  const highlightBorder = border ?? theme.highlight.border;

  if (highlightRange.startRowIdx > highlightRange.endRowIdx) throw new Error("Invalid range! Start row index is greater than end row index!");
  if (highlightRange.startColIdx > highlightRange.endColIdx) throw new Error("Invalid range! Start column index is greater than end column index!");

  // Highlight is outside of parent range
  if (highlightRange.startColIdx >= parentPaneRange.endColIdx) return null;
  if (highlightRange.startRowIdx >= parentPaneRange.endRowIdx) return null;
  if (highlightRange.endColIdx <= parentPaneRange.startColIdx) return null;
  if (highlightRange.endRowIdx <= parentPaneRange.startRowIdx) return null;

  const shouldRenderTopBorder = highlightRange.startRowIdx >= parentPaneRange.startRowIdx;
  const shouldRenderRightBorder = highlightRange.endColIdx <= parentPaneRange.endColIdx;
  const shouldRenderBottomBorder = highlightRange.endRowIdx <= parentPaneRange.endRowIdx;
  const shouldRenderLeftBorder = highlightRange.startColIdx >= parentPaneRange.startColIdx;

  let width = "100%";
  let height = "100%";

  // If the highlight part only renders one border (e.g. top border), we need to subtract the border width from the height/width
  if (shouldRenderTopBorder || shouldRenderBottomBorder) height = `calc(100% - ${highlightBorder.width})`;
  if (shouldRenderLeftBorder || shouldRenderRightBorder) width = `calc(100% - ${highlightBorder.width})`;

  // If the highlight part renders two borders (e.g. top and bottom border), we need to subtract the border width * 2 from the height/width
  if (shouldRenderTopBorder && shouldRenderBottomBorder) height = `calc(100% - ${highlightBorder.width} * 2)`;
  if (shouldRenderLeftBorder && shouldRenderRightBorder) width = `calc(100% - ${highlightBorder.width} * 2)`;

  const baseStyle: CSSProperties = {
    borderTop: shouldRenderTopBorder ? `${highlightBorder.width} ${highlightBorder.style} ${highlightBorder.color}` : "none",
    borderRight: shouldRenderRightBorder ? `${highlightBorder.width} ${highlightBorder.style} ${highlightBorder.color}` : "none",
    borderBottom: shouldRenderBottomBorder ? `${highlightBorder.width} ${highlightBorder.style} ${highlightBorder.color}` : "none",
    borderLeft: shouldRenderLeftBorder ? `${highlightBorder.width} ${highlightBorder.style} ${highlightBorder.color}` : "none",

    gridRowStart: highlightRange.startRowIdx < parentPaneRange.startRowIdx ? parentPaneRange.startRowIdx + 1 : highlightRange.startRowIdx + 1,
    gridRowEnd: highlightRange.endRowIdx > parentPaneRange.endRowIdx ? parentPaneRange.endRowIdx + 1 : highlightRange.endRowIdx + 1,

    gridColumnStart: highlightRange.startColIdx < parentPaneRange.startColIdx ? parentPaneRange.startColIdx + 1 : highlightRange.startColIdx + 1,
    gridColumnEnd: highlightRange.endColIdx > parentPaneRange.endColIdx ? parentPaneRange.endColIdx + 1 : highlightRange.endColIdx + 1,
  };

  // Matches: "TopLeft", "TopCenter" and "TopRight"
  if (parentPaneName.startsWith("Top")) {
    baseStyle.position = "sticky";
    offset.top = getCellOffset?.(highlightRange.startRowIdx, highlightRange.startColIdx, 1, 1).top;

    // If the highlight part is on the sticky pane and renders only one border, 
    // we need to adjust the height/width such that the border sticks out a bit (at a length of gap width)
    if (!shouldRenderBottomBorder) height = `calc(100% - (${highlightBorder.width} - ${theme.grid.gap.width}))`;
  }
  // Matches: "TopRight", "Right" and "BottomRight"
  if (parentPaneName.endsWith("Right")) {
    baseStyle.position = "sticky";
    offset.right = getCellOffset?.(highlightRange.startRowIdx, highlightRange.endColIdx - parentPaneRange.startColIdx - 1, 1, 1).right;
    
    if (!shouldRenderLeftBorder) width = `calc(100% - (${highlightBorder.width} - ${theme.grid.gap.width}))`;
  }
  // Matches: "BottomLeft", "BottomCenter" and "BottomRight"
  if (parentPaneName.startsWith("Bottom")) {
    baseStyle.position = "sticky";
    offset.bottom = getCellOffset?.(highlightRange.endRowIdx - parentPaneRange.startRowIdx - 1, highlightRange.startColIdx, 1, 1).bottom;
    
    if (!shouldRenderTopBorder) height = `calc(100% - (${highlightBorder.width} - ${theme.grid.gap.width}))`;
  }
  // Matches: "TopLeft", "Left" and "BottomLeft"
  if (parentPaneName.endsWith("Left")) {
    baseStyle.position = "sticky";
    offset.left = getCellOffset?.(highlightRange.startRowIdx, highlightRange.startColIdx, 1, 1).left;
    
    if (!shouldRenderRightBorder) width = `calc(100% - (${highlightBorder.width} - ${theme.grid.gap.width}))`;
  }

  return (
    <div
      className="rgPartialHighlight"
      style={{
        ...style,
        width,
        height,
        ...offset,
        ...baseStyle,
      }} />
  );
};
