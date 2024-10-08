import React, { CSSProperties, useCallback, useEffect, useRef } from "react";
import { NumericalRange } from "../types/PublicModel";
import { EMPTY_AREA, GetCellOffsets, PaneName, StickyOffsets } from "../types/InternalModel";
import { isSpanMember } from "../utils/isSpanMember";
import { areAreasEqual } from "../utils/areAreasEqual";
import { reactGridStores, useReactGridStore } from "../utils/reactGridStore";
import { useTheme } from "../hooks/useTheme";
import { CellContextProvider } from "./CellContext";
import { PartialArea } from "./PartialArea";
import { useReactGridId } from "./ReactGridIdProvider";
import { RGTheme } from "../types/RGTheme";
import isEqual from "lodash.isequal";
import { isCellInRange } from "../utils/isCellInRange";
import { RowReorderBehavior } from "../behaviors/RowReorderBehavior";
import { DefaultBehavior } from "../behaviors/DefaultBehavior";
import { ColumnReorderBehavior } from "../behaviors/ColumnReorderBehavior";

interface PaneGridContentProps {
  range: NumericalRange;
  className?: string;
  style?: React.CSSProperties;
  stickyOffsets?: StickyOffsets;
  getCellOffset?: (rowIdx: number, colIdx: number, rowSpan: number, colSpan: number) => CSSProperties;
}

const shouldMemoGridContent = (prevProps: PaneGridContentProps, nextProps: PaneGridContentProps) => {
  const {
    startRowIdx: prevStartRowIdx,
    endRowIdx: prevEndRowIdx,
    startColIdx: prevStartColIdx,
    endColIdx: prevEndColIdx,
  } = prevProps.range;

  const {
    startRowIdx: nextStartRowIdx,
    endRowIdx: nextEndRowIdx,
    startColIdx: nextStartColIdx,
    endColIdx: nextEndColIdx,
  } = nextProps.range;

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

export const PaneGridContent: React.FC<PaneGridContentProps> = React.memo(
  ({ range, getCellOffset = () => ({}), stickyOffsets }) => {
    const { startRowIdx, endRowIdx, startColIdx, endColIdx } = range;

    const id = useReactGridId();
    const store = reactGridStores()[id].getState();

    const rows = useReactGridStore(id, (store) => store.rows).slice(startRowIdx, endRowIdx);
    const columns = useReactGridStore(id, (store) => store.columns).slice(startColIdx, endColIdx);
    const cells = useReactGridStore(id, (store) => store.cells);
    const focusedCell = useReactGridStore(id, (store) => store.focusedLocation);
    const selectedArea = useReactGridStore(id, (store) => store.selectedArea);

    const currentBehavior = useReactGridStore(id, (store) => store.currentBehavior);
    const prevBehaviorId = useRef(currentBehavior.id);
    const prevSelectedArea = useRef(selectedArea);

    useEffect(() => {
      return () => {
        prevBehaviorId.current = currentBehavior.id;
        prevSelectedArea.current = selectedArea;
      };
    }, [currentBehavior.id, selectedArea]);

    const memoizedGetCellOffset = useCallback(getCellOffset, [stickyOffsets]);

    return rows.map((_, rowIndex) => {
      return columns.map((_, colIndex) => {
        const cell = cells.get(`${startRowIdx + rowIndex} ${startColIdx + colIndex}`);

        if (!cell || isSpanMember(cell)) return null;

        const realRowIndex = startRowIdx + rowIndex;
        const realColumnIndex = startColIdx + colIndex;

        let shouldRenderReorderedCells = false;

        if (
          (prevBehaviorId.current === RowReorderBehavior.id || prevBehaviorId.current === ColumnReorderBehavior.id) &&
          currentBehavior.id === DefaultBehavior().id
        ) {
          const prevSelection = prevSelectedArea.current;
          const currentSelection = selectedArea;

          shouldRenderReorderedCells = isCellInRange(store, cell, {
            startRowIdx: Math.min(prevSelection.startRowIdx, currentSelection.startRowIdx),
            endRowIdx: Math.max(prevSelection.endRowIdx, currentSelection.endRowIdx),
            startColIdx: Math.min(prevSelection.startColIdx, currentSelection.startColIdx),
            endColIdx: Math.max(prevSelection.endColIdx, currentSelection.endColIdx),
          });
        }

        const isCellSelected = isCellInRange(store, cell, selectedArea);

        const isFocused = focusedCell.rowIndex === realRowIndex && focusedCell.colIndex === realColumnIndex;

        return (
          <CellContextProvider
            key={`${realRowIndex}-${realColumnIndex}`}
            rowIndex={rowIndex}
            colIndex={colIndex}
            cell={cell}
            rowSpan={cell.rowSpan}
            colSpan={cell.colSpan}
            realRowIndex={realRowIndex}
            realColumnIndex={realColumnIndex}
            getCellOffset={memoizedGetCellOffset}
            shouldRenderReorderedCells={shouldRenderReorderedCells}
            isCellSelected={isCellSelected}
            isFocused={isFocused}
          />
        );
      });
    });
  },
  shouldMemoGridContent
);

const getPaneBackgroundStyle = (paneName: PaneName, range: NumericalRange, gap: RGTheme["gap"]) => {
  let style: CSSProperties = {
    position: "sticky",
    gridRowStart: range.startRowIdx + 1,
    gridRowEnd: range.endRowIdx + 1,
    gridColumnStart: range.startColIdx + 1,
    gridColumnEnd: range.endColIdx + 1,
    backgroundColor: gap.color,
  };

  if (paneName === "TopLeft" || paneName === "TopCenter" || paneName === "TopRight") {
    style = {
      ...style,
      top: 0,
      height: `calc(100% + 2*${gap.width})`,
      marginTop: `-${gap.width}`,
    };
  }
  if (paneName === "TopRight" || paneName === "Right" || paneName === "BottomRight") {
    style = {
      ...style,
      right: 0,
      width: `calc(100% + 2*${gap.width})`,
      marginLeft: `-${gap.width}`,
    };
  }
  if (paneName === "BottomLeft" || paneName === "BottomCenter" || paneName === "BottomRight") {
    style = {
      ...style,
      bottom: 0,
      height: `calc(100% + 2*${gap.width})`,
      marginTop: `-${gap.width}`,
    };
  }
  if (paneName === "TopLeft" || paneName === "Left" || paneName === "BottomLeft") {
    style = {
      ...style,
      left: 0,
      width: `calc(100% + 2*${gap.width})`,
      marginLeft: `-${gap.width}`,
    };
  }

  return style;
};

interface PaneProps {
  paneName: PaneName;
  style?: React.CSSProperties;

  gridContentRange: NumericalRange;
  getCellOffset?: GetCellOffsets;
  stickyOffsets?: StickyOffsets;

  shouldRender?: boolean;
}

export const Pane: React.FC<PaneProps> = ({
  paneName,
  style,
  gridContentRange,
  getCellOffset,
  stickyOffsets,
  shouldRender = true,
}) => {
  const theme = useTheme();
  const id = useReactGridId();
  const focusedCell = useReactGridStore(id, (store) => store.getFocusedCell());
  const focusedCellArea = focusedCell
    ? {
        startRowIdx: focusedCell.rowIndex,
        endRowIdx: focusedCell.rowIndex + (focusedCell.rowSpan ?? 1),
        startColIdx: focusedCell.colIndex,
        endColIdx: focusedCell.colIndex + (focusedCell.colSpan ?? 1),
      }
    : EMPTY_AREA;

  const selectedArea = useReactGridStore(id, (store) => store.selectedArea);

  const fillHandleArea = useReactGridStore(id, (store) => store.fillHandleArea);

  const isFillHandleActive = !isEqual(fillHandleArea, EMPTY_AREA);

  if (!shouldRender) return null;

  return (
    <div className={`rgPane rgPane-${paneName}`} style={{ display: "contents", ...style }}>
      {paneName !== "Center" && (
        <div
          className={`rgPaneBackground rgPaneBackground-${paneName}`}
          style={getPaneBackgroundStyle(paneName, gridContentRange, theme.gap)}
        />
      )}
      <PaneGridContent range={gridContentRange} getCellOffset={getCellOffset} stickyOffsets={stickyOffsets} />
      {isFillHandleActive && (
        <PartialArea
          areaRange={fillHandleArea}
          parentPaneRange={gridContentRange}
          parentPaneName={paneName}
          getCellOffset={getCellOffset}
          isFillHandlePartial
          border={theme.fillHandle.border}
          style={{ background: theme.focusIndicator.background }}
          className="rgFillHandleIndicator"
        />
      )}
      {selectedArea && !areAreasEqual(focusedCellArea, selectedArea) && (
        <PartialArea
          areaRange={{
            startRowIdx: selectedArea.startRowIdx,
            endRowIdx: selectedArea.endRowIdx,
            startColIdx: selectedArea.startColIdx,
            endColIdx: selectedArea.endColIdx,
          }}
          parentPaneRange={gridContentRange}
          parentPaneName={paneName}
          getCellOffset={getCellOffset}
          border={theme.selectionIndicator.border}
          style={{ background: theme.selectionIndicator.background }}
          className="rgSelectionIndicator"
        />
      )}

      {focusedCell && (
        <PartialArea
          areaRange={focusedCellArea}
          parentPaneRange={gridContentRange}
          parentPaneName={paneName}
          getCellOffset={getCellOffset}
          isFocusedCellPartial
          border={theme.focusIndicator.border}
          style={{ background: theme.focusIndicator.background }}
          className="rgFocusIndicator"
        />
      )}
    </div>
  );
};
