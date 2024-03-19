import React, { CSSProperties, FC } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { GetCellOffsets, PaneName } from "../types/InternalModel";
import { Border, Offset } from "../types/Theme";
import { useTheme } from "../hooks/useTheme";

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
};

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
export const PartialArea: FC<PartialAreaProps> = React.memo(
  ({ areaRange, parentPaneName, parentPaneRange, getCellOffset, border, style, className }) => {
    const theme = useTheme();
    const offset: Offset = {};
    const areaBorder = border ?? theme.area.border;

    if (areaRange.startRowIdx < 0 || areaRange.startColIdx < 0 || areaRange.endRowIdx < 0 || areaRange.endColIdx < 0)
      return null;

    if (areaRange.startRowIdx > areaRange.endRowIdx)
      throw new Error("Invalid range! Start row index is greater than end row index!");
    if (areaRange.startColIdx > areaRange.endColIdx)
      throw new Error("Invalid range! Start column index is greater than end column index!");

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

    const baseStyle: CSSProperties = {
      gridRowStart:
        areaRange.startRowIdx < parentPaneRange.startRowIdx
          ? parentPaneRange.startRowIdx + 1
          : areaRange.startRowIdx + 1,
      gridRowEnd:
        areaRange.endRowIdx > parentPaneRange.endRowIdx ? parentPaneRange.endRowIdx + 1 : areaRange.endRowIdx + 1,

      gridColumnStart:
        areaRange.startColIdx < parentPaneRange.startColIdx
          ? parentPaneRange.startColIdx + 1
          : areaRange.startColIdx + 1,
      gridColumnEnd:
        areaRange.endColIdx > parentPaneRange.endColIdx ? parentPaneRange.endColIdx + 1 : areaRange.endColIdx + 1,
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
      offset.right = getCellOffset?.(
        areaRange.startRowIdx,
        areaRange.endColIdx - parentPaneRange.startColIdx - 1,
        1,
        1
      ).right;

      if (!shouldRenderLeftBorder) width = `calc(100% - (${areaBorder.width} - ${theme.grid.gap.width}))`;
    }
    if (parentPaneName === "BottomLeft" || parentPaneName === "BottomCenter" || parentPaneName === "BottomRight") {
      baseStyle.position = "sticky";
      offset.bottom = getCellOffset?.(
        areaRange.endRowIdx - parentPaneRange.startRowIdx - 1,
        areaRange.startColIdx,
        1,
        1
      ).bottom;

      if (!shouldRenderTopBorder) height = `calc(100% - (${areaBorder.width} - ${theme.grid.gap.width}))`;
    }
    if (parentPaneName === "TopLeft" || parentPaneName === "Left" || parentPaneName === "BottomLeft") {
      baseStyle.position = "sticky";
      offset.left = getCellOffset?.(areaRange.startRowIdx, areaRange.startColIdx, 1, 1).left;

      if (!shouldRenderRightBorder) width = `calc(100% - (${areaBorder.width} - ${theme.grid.gap.width}))`;
    }

    return (
      <>
        <div
          className={`rgPartialArea ${className ?? ""}`}
          style={{
            ...style,
            width,
            height,
            boxSizing: "border-box",
            position: "sticky",
            pointerEvents: "none",
            ...offset,
            ...baseStyle,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: `-${theme.grid.gap.width}`,
              right: `-${theme.grid.gap.width}`,
              bottom: `-${theme.grid.gap.width}`,
              left: `-${theme.grid.gap.width}`,

              ...(shouldRenderTopBorder && {
                borderTop: `${theme.focusIndicator.border.width} ${areaBorder.style} ${areaBorder.color}`,
              }),
              ...(shouldRenderRightBorder && {
                borderRight: `${theme.focusIndicator.border.width} ${areaBorder.style} ${areaBorder.color}`,
              }),
              ...(shouldRenderBottomBorder && {
                borderBottom: `${theme.focusIndicator.border.width} ${areaBorder.style} ${areaBorder.color}`,
              }),
              ...(shouldRenderLeftBorder && {
                borderLeft: `${theme.focusIndicator.border.width} ${areaBorder.style} ${areaBorder.color}`,
              }),
            }}
          />
        </div>
      </>
    );
  },
  shouldMemoPartialArea
);
