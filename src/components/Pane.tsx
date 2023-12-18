import React, { CSSProperties } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { GetCellOffsets, PaneName } from "../types/InternalModel";
import { RGTheme } from "../types/Theme";
import { areAreasEqual, isSpanMember } from "../utils/cellUtils";
import { useReactGridStore } from "../utils/reactGridStore";
import { useTheme } from "../utils/useTheme";
import { CellContext } from "./CellContext";
import { PartialArea } from "./PartialArea";
import { useReactGridId } from "./ReactGridIdProvider";

interface PaneGridContentProps {
  range: NumericalRange;
  className?: string;
  style?: React.CSSProperties;
  getCellOffset?: (
    rowIdx: number,
    colIdx: number,
    rowSpan: number,
    colSpan: number
  ) => CSSProperties;
}

const shouldMemoGridContent = (prevProps: PaneGridContentProps, nextProps: PaneGridContentProps) => {
  const { 
    startRowIdx: prevStartRowIdx, 
    endRowIdx: prevEndRowIdx,
    startColIdx: prevStartColIdx,
    endColIdx: prevEndColIdx
  } = prevProps.range;

  const { 
    startRowIdx: nextStartRowIdx, 
    endRowIdx: nextEndRowIdx,
    startColIdx: nextStartColIdx,
    endColIdx: nextEndColIdx
  } = nextProps.range;

  if (
    prevStartRowIdx !== nextStartRowIdx ||
    prevEndRowIdx !== nextEndRowIdx ||
    prevStartColIdx !== nextStartColIdx ||
    prevEndColIdx !== nextEndColIdx ||
    prevProps.style !== nextProps.style ||
    prevProps.getCellOffset !== nextProps.getCellOffset
  ) {
    return false;
  }

  return true;
};

export const PaneGridContent: React.FC<PaneGridContentProps> = React.memo(({
  range,
  getCellOffset,
}) => {
  const { startRowIdx, endRowIdx, startColIdx, endColIdx } = range;

  const id = useReactGridId();
  const rows = useReactGridStore(id, store => store.rows).slice(
    startRowIdx,
    endRowIdx
  );
  const columns = useReactGridStore(id, store => store.columns).slice(
    startColIdx,
    endColIdx
  );
  const cells = useReactGridStore(id, store => store.cells);

  const focusedCell = useReactGridStore(id, store => store.focusedLocation);
  const currentlyEditedCell = useReactGridStore(id, store => store.currentlyEditedCell);

  const hiddenFocusTargetRef = useReactGridStore(id, store => store.hiddenFocusTargetRef);

  const setFocusedLocation = useReactGridStore(id, (store) => store.setFocusedLocation);
  const setCurrentlyEditedCell = useReactGridStore(id, (store) => store.setCurrentlyEditedCell);

  return rows.map((row, rowIndex) => {
    return columns.map((col, colIndex) => {
      const cell = cells.get(`${row.id} ${col.id}`);

      if (!cell || isSpanMember(cell)) return null;

      const realRowIndex = startRowIdx + rowIndex;
      const realColumnIndex = startColIdx + colIndex;

      const isFocused = focusedCell.rowIndex === realRowIndex && focusedCell.colIndex === realColumnIndex;
      const isInEditMode = currentlyEditedCell.rowIndex === realRowIndex && currentlyEditedCell.colIndex === realColumnIndex;

      const { Template, props } = cell;

      return (
        <CellContext.Provider
          key={`${realRowIndex}-${realColumnIndex}`}
          value={{
            rowId: row.id,
            colId: col.id,
            realRowIndex,
            realColumnIndex,
            rowSpan: cell.rowSpan,
            colSpan: cell.colSpan,
            containerStyle: {
              ...(cell.rowSpan && {
                gridRowEnd: `span ${cell.rowSpan}`,
              }),
              ...(cell.colSpan && {
                gridColumnEnd: `span ${cell.colSpan}`,
              }),
              ...getCellOffset?.(
                rowIndex,
                colIndex,
                cell.rowSpan ?? 1,
                cell.colSpan ?? 1
              ),
              gridRowStart: realRowIndex + 1,
              gridColumnStart: realColumnIndex + 1,
            },
            disableEditMode: () => {
              setCurrentlyEditedCell(-1, -1);
              hiddenFocusTargetRef?.focus({ preventScroll: true });
            },
            requestFocus: (enableEditMode: boolean) => {
              if (enableEditMode) {
                setCurrentlyEditedCell(realRowIndex, realColumnIndex);
              }

              setFocusedLocation(realRowIndex, realColumnIndex);
            },
            isInEditMode,
            isFocused,
          }}
        >
          <Template {...props} />
        </CellContext.Provider>
      );
    });
  });
}, shouldMemoGridContent);

const getPaneBackgroundStyle = (paneName: PaneName, range: NumericalRange, gap: RGTheme['grid']['gap']) => {
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

  shouldRender?: boolean;
}

export const Pane: React.FC<PaneProps> = ({
  paneName,
  style,
  gridContentRange,
  getCellOffset,
  shouldRender = true,
}) => {
  const theme = useTheme();
  const id = useReactGridId();
  const focusedCell = useReactGridStore(id, store => store.getFocusedCell());
  const focusedCellArea = focusedCell ? {
    startRowIdx: focusedCell.rowIndex,
    endRowIdx: focusedCell.rowIndex + (focusedCell.rowSpan ?? 1),
    startColIdx: focusedCell.colIndex,
    endColIdx: focusedCell.colIndex + (focusedCell.colSpan ?? 1),
  } : { startRowIdx: -1, endRowIdx: -1, startColIdx: -1, endColIdx: -1 };
  const selectedArea = useReactGridStore(id, (store) => store.selectedArea);
  // const { state, range, borders, cellRenderer } = props;

  if (!shouldRender) return null;

  return (
    <div className={`rgPane rgPane-${paneName}`} style={{ display: "contents", ...style }}>
      {paneName !== "Center" && (
        <div
          className={`rgPaneBackground rgPaneBackground-${paneName}`}
          style={getPaneBackgroundStyle(paneName, gridContentRange, theme.grid.gap)}
        />
      )}
      <PaneGridContent range={gridContentRange} getCellOffset={getCellOffset} />
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
          border={theme.focusIndicator.border}
          style={{ background: theme.focusIndicator.background }}
          className="rgFocusIndicator"
        />
      )}
      {/* <SelectedArea parentPaneName={paneName} parentPaneRange={gridContentRange} getCellOffset={getCellOffset} /> */}
      {/* {renderHighlights(state, calculatedRange)}
          {state.focusedLocation && !(state.currentlyEditedCell && isMobileDevice()) && calculatedRange.contains(state.focusedLocation) &&
              <CellFocus location={state.focusedLocation} />}
          <SelectedRanges
              state={state}
              calculatedRange={calculatedRange}
          />
          <FillHandleRangeSelection
              state={state}
              calculatedRange={calculatedRange}
          />
          <FillHandleRenderer
              state={state}
              calculatedRange={calculatedRange}
          /> */}
    </div>
  );
};
