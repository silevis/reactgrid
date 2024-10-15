import React, { CSSProperties, FC } from "react";
import { NumericalRange } from "../types/PublicModel";
import { EMPTY_AREA, GetCellOffsets, PaneName } from "../types/InternalModel";
import { useTheme } from "../hooks/useTheme";
import { useReactGridId } from "./ReactGridIdProvider";
import { reactGridStores, useReactGridStore } from "../utils/reactGridStore";
import { FillHandleBehavior } from "../behaviors/FillHandleBehavior";
import { CellSelectionBehavior } from "../behaviors/CellSelectionBehavior";
import { getCellArea } from "../utils/getCellArea";
import { areAreasEqual } from "../utils/areAreasEqual";
import { Border, Offset } from "../types/RGTheme";
import isEqual from "lodash.isequal";
import { isCellInRange } from "../utils/isCellInRange";

interface PartialAreaProps {
  /** The range of cells to area. */
  areaRange: NumericalRange;
  /** The name of the parent pane (e.g. "TopLeft", "BottomRight"). */
  parentPaneName: PaneName;
  /** The range of cells in the parent pane. */
  parentPaneRange: NumericalRange;
  /** A function that returns the offset of a cell relative to the grid. */
  border?: Border;
  /** Specifies whether PartialArea is a focused cell. */
  isFocusedCellPartial?: boolean;
  /** Specifies whether the area is a fill handle. */
  isFillHandlePartial?: boolean;
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
  ({
    areaRange,
    parentPaneName,
    parentPaneRange,
    getCellOffset,
    isFocusedCellPartial = false,
    isFillHandlePartial = false,
    border,
    style,
    className,
  }) => {
    const theme = useTheme();
    const offset: Offset = {};
    const areaBorder = border ?? theme.area.border;

    const id = useReactGridId();
    const store = reactGridStores()[id].getState();
    const currentBehavior = useReactGridStore(id, (store) => store.currentBehavior);
    const setCurrentBehavior = useReactGridStore(id, (store) => store.setCurrentBehavior);

    const selectedArea = useReactGridStore(id, (store) => store.selectedArea);
    const paneRanges = useReactGridStore(id, (store) => store.paneRanges);
    const fillHandleArea = useReactGridStore(id, (store) => store.fillHandleArea);
    const disableFillHandle = useReactGridStore(id, (store) => store.disableFillHandle);
    const focusedCell =
      store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex) ?? undefined;

    const focusedCellArea = focusedCell ? getCellArea(store, focusedCell) : EMPTY_AREA;

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

    let shouldRenderTopBorder = false;
    if (areaRange.startRowIdx >= parentPaneRange.startRowIdx) {
      if (!isFillHandlePartial) {
        shouldRenderTopBorder = true;
      } else if (
        selectedArea.startRowIdx > focusedCellArea.endRowIdx &&
        !isEqual(selectedArea, EMPTY_AREA) &&
        !isCellInRange(store, focusedCell, selectedArea) &&
        fillHandleArea.startRowIdx < selectedArea.startRowIdx
      ) {
        shouldRenderTopBorder = true;
      } else if (
        fillHandleArea.startRowIdx !== focusedCellArea.endRowIdx &&
        fillHandleArea.startRowIdx !== selectedArea.endRowIdx
      ) {
        shouldRenderTopBorder = true;
      }
    }

    let shouldRenderRightBorder = false;
    if (areaRange.endColIdx <= parentPaneRange.endColIdx) {
      if (!isFillHandlePartial) {
        shouldRenderRightBorder = true;
      } else if (
        selectedArea.startColIdx < focusedCellArea.endColIdx &&
        !isEqual(selectedArea, EMPTY_AREA) &&
        !isCellInRange(store, focusedCell, selectedArea) &&
        fillHandleArea.endColIdx > selectedArea.endColIdx
      ) {
        shouldRenderRightBorder = true;
      } else if (
        fillHandleArea.endColIdx !== focusedCellArea.startColIdx &&
        fillHandleArea.endColIdx !== selectedArea.startColIdx
      ) {
        shouldRenderRightBorder = true;
      }
    }

    let shouldRenderBottomBorder = false;
    if (areaRange.endRowIdx <= parentPaneRange.endRowIdx) {
      if (!isFillHandlePartial) {
        shouldRenderBottomBorder = true;
      } else if (
        selectedArea.startRowIdx < focusedCellArea.endRowIdx &&
        !isEqual(selectedArea, EMPTY_AREA) &&
        !isCellInRange(store, focusedCell, selectedArea) &&
        fillHandleArea.endRowIdx > selectedArea.endRowIdx
      ) {
        shouldRenderBottomBorder = true;
      } else if (
        fillHandleArea.endRowIdx !== focusedCellArea.startRowIdx &&
        fillHandleArea.endRowIdx !== selectedArea.startRowIdx
      ) {
        shouldRenderBottomBorder = true;
      }
    }

    let shouldRenderLeftBorder = false;
    if (areaRange.startColIdx >= parentPaneRange.startColIdx) {
      if (!isFillHandlePartial) {
        shouldRenderLeftBorder = true;
      } else if (
        selectedArea.startColIdx > focusedCellArea.endColIdx &&
        !isEqual(selectedArea, EMPTY_AREA) &&
        !isCellInRange(store, focusedCell, selectedArea) &&
        fillHandleArea.startColIdx < selectedArea.startColIdx
      ) {
        shouldRenderLeftBorder = true;
      } else if (
        fillHandleArea.startColIdx !== focusedCellArea.endColIdx &&
        fillHandleArea.startColIdx !== selectedArea.endColIdx
      ) {
        shouldRenderLeftBorder = true;
      }
    }

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
      if (!shouldRenderBottomBorder) height = `calc(100% - (${areaBorder.width} - ${theme.gap.width}))`;
    }
    if (parentPaneName === "TopRight" || parentPaneName === "Right" || parentPaneName === "BottomRight") {
      baseStyle.position = "sticky";
      offset.right = getCellOffset?.(
        areaRange.startRowIdx,
        areaRange.endColIdx - parentPaneRange.startColIdx - 1,
        1,
        1
      ).right;

      if (!shouldRenderLeftBorder) width = `calc(100% - (${areaBorder.width} - ${theme.gap.width}))`;
    }
    if (parentPaneName === "BottomLeft" || parentPaneName === "BottomCenter" || parentPaneName === "BottomRight") {
      baseStyle.position = "sticky";
      offset.bottom = getCellOffset?.(
        areaRange.endRowIdx - parentPaneRange.startRowIdx - 1,
        areaRange.startColIdx,
        1,
        1
      ).bottom;

      if (!shouldRenderTopBorder) height = `calc(100% - (${areaBorder.width} - ${theme.gap.width}))`;
    }
    if (parentPaneName === "TopLeft" || parentPaneName === "Left" || parentPaneName === "BottomLeft") {
      baseStyle.position = "sticky";
      offset.left = getCellOffset?.(areaRange.startRowIdx, areaRange.startColIdx, 1, 1).left;

      if (!shouldRenderRightBorder) width = `calc(100% - (${areaBorder.width} - ${theme.gap.width}))`;
    }

    let shouldEnableFillHandle = false;

    if (!disableFillHandle) {
      const isTopPane = ["TopLeft", "TopCenter", "TopRight"].includes(parentPaneName);
      const isCenterPane = ["Left", "Center", "Right"].includes(parentPaneName);

      const exceedsRowLimit =
        (isTopPane && selectedArea.endRowIdx > paneRanges.TopCenter.endRowIdx) ||
        (isCenterPane && selectedArea.endRowIdx > paneRanges.Center.endRowIdx);

      const exceedsColLimit =
        (parentPaneName === "TopLeft" && selectedArea.endColIdx > paneRanges.TopLeft.endColIdx) ||
        (parentPaneName === "TopCenter" && selectedArea.endColIdx > paneRanges.TopCenter.endColIdx) ||
        (parentPaneName === "Left" && selectedArea.endColIdx > paneRanges.Left.endColIdx) ||
        (parentPaneName === "Center" && selectedArea.endColIdx > paneRanges.Center.endColIdx) ||
        (parentPaneName === "BottomLeft" && selectedArea.endColIdx > paneRanges.BottomLeft.endColIdx) ||
        (parentPaneName === "BottomCenter" && selectedArea.endColIdx > paneRanges.BottomCenter.endColIdx);

      // `exceedsRowLimit` and `exceedsColLimit` are used to prevent showing multiple fill handle buttons when selected area exceeds the pane limits

      if (!isEqual(selectedArea, EMPTY_AREA)) {
        if (isFocusedCellPartial && areAreasEqual(selectedArea, focusedCellArea)) {
          if (!(exceedsRowLimit || exceedsColLimit)) {
            shouldEnableFillHandle = true;
          }
        } else if (!isFocusedCellPartial && !isFillHandlePartial) {
          if (!(exceedsRowLimit || exceedsColLimit)) {
            shouldEnableFillHandle = true;
          }
        }
      } else if (isFocusedCellPartial) {
        shouldEnableFillHandle = true;
      }
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
              top: `-${theme.gap.width}`,
              right: `-${theme.gap.width}`,
              bottom: `-${theme.gap.width}`,
              left: `-${theme.gap.width}`,

              ...(shouldRenderTopBorder && {
                borderTop: `${areaBorder.width} ${areaBorder.style} ${areaBorder.color}`,
              }),
              ...(shouldRenderRightBorder && {
                borderRight: `${areaBorder.width} ${areaBorder.style} ${areaBorder.color}`,
              }),
              ...(shouldRenderBottomBorder && {
                borderBottom: `${areaBorder.width} ${areaBorder.style} ${areaBorder.color}`,
              }),
              ...(shouldRenderLeftBorder && {
                borderLeft: `${areaBorder.width} ${areaBorder.style} ${areaBorder.color}`,
              }),
            }}
          />
          {currentBehavior.id !== CellSelectionBehavior.id && shouldEnableFillHandle && (
            <div
              className="rg-touch-fill-handle"
              style={
                {
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  right: `calc(-${theme.gap.width} - 15px)`,
                  bottom: `calc(-${theme.gap.width} - 15px)`,
                  width: 30,
                  height: 30,
                  pointerEvents: "auto",
                  touchAction: "none",
                } as CSSProperties
              }
              onPointerDown={(event) => {
                if (event.pointerType !== "mouse") {
                  setCurrentBehavior(FillHandleBehavior);
                }
              }}
            >
              <div
                className="rg-fill-handle"
                style={{
                  width: 6.5,
                  height: 6.5,
                  backgroundColor: isFillHandlePartial ? areaBorder.color : theme.focusIndicator.border.color,
                  cursor: "crosshair",
                  boxSizing: "content-box",
                  pointerEvents: "auto",
                  border: "2px solid #fff",
                  borderRadius: "50%",
                }}
                onPointerDown={() => setCurrentBehavior(FillHandleBehavior)}
              />
            </div>
          )}
        </div>
      </>
    );
  },
  shouldMemoPartialArea
);
