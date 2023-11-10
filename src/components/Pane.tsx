import React, { CSSProperties } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { GetCellOffsets, PaneName } from "../types/InternalModel";
import { useReactGridStore } from "../utils/reactGridStore";
import { useTheme } from "../utils/useTheme";
import { CellWrapper } from "./CellWrapper";
import { useReactGridId } from "./ReactGridIdProvider";
import { RGTheme } from "../types/Theme";
import { css, keyframes } from "@emotion/react";
import { PartialHighlight } from "./PartialHighlight";

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

export const PaneGridContent: React.FC<PaneGridContentProps> = ({
  range,
  getCellOffset,
}) => {
  const theme = useTheme();
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

  const focusedCell = useReactGridStore(id, store => store.focusedCell);
  const currentlyEditedCell = useReactGridStore(id, store => store.currentlyEditedCell);

  return rows.map((row, rowIndex) => {
    return columns.map((col, colIndex) => {
      const cell = cells.get(`${row.id} ${col.id}`);

      if (!cell) return null;

      const realRowIndex = startRowIdx + rowIndex;
      const realColumnIndex = startColIdx + colIndex;

      const isFocused = focusedCell.rowIndex === realRowIndex && focusedCell.colIndex === realColumnIndex;
      const isInEditMode = currentlyEditedCell.rowIndex === realRowIndex && currentlyEditedCell.colIndex === realColumnIndex;

      const { Template, props } = cell;

      return (
        <CellWrapper
          key={`${realRowIndex}-${realColumnIndex}`}
          rowId={row.id}
          colId={col.id}
          realRowIndex={realRowIndex}
          realColumnIndex={realColumnIndex}
          getContainerStyle={() => ({
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
          })}
          isFocused={isFocused}
          isInEditMode={isInEditMode}
        >
          <Template {...props} />
        </CellWrapper>
      );
    });
  });
};

const getPaneBackgroundStyle = (paneName: PaneName, range: NumericalRange, gap: RGTheme['grid']['gap']) => {
  let style: CSSProperties = {
    position: "sticky",
    gridRowStart: range.startRowIdx + 1,
    gridRowEnd: range.endRowIdx + 1,
    gridColumnStart: range.startColIdx + 1,
    gridColumnEnd: range.endColIdx + 1,
    backgroundColor: gap.color,
  };

  // Matches "TopLeft", "TopCenter" and "TopRight"
  if (paneName.startsWith("Top")) {
    style = {
      ...style,
      top: 0,
      height: `calc(100% + 2*${gap.width})`,
      marginTop: `-${gap.width}`,
    };
  }
  // Matches "TopRight", "Right" and "BottomRight"
  if (paneName.endsWith("Right")) {
    style = {
      ...style,
      right: 0,
      width: `calc(100% + 2*${gap.width})`,
      marginLeft: `-${gap.width}`,
    };
  }
  // Matches "BottomLeft", "BottomCenter" and "BottomRight"
  if (paneName.startsWith("Bottom")) {
    style = {
      ...style,
      bottom: 0,
      height: `calc(100% + 2*${gap.width})`,
      marginTop: `-${gap.width}`,
    };
  }
  // Matches "TopLeft", "Left" and "BottomLeft"
  if (paneName.endsWith("Left")) {
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
  // const { state, range, borders, cellRenderer } = props;

  if (!shouldRender) return null;

  return (
    <div className={`rgPane rgPane-${paneName}`} style={{ display: "contents", ...style }} >
      {paneName !== "Center" && (
        <div
          className={`rgPaneBackground rgPaneBackground-${paneName}`}
          style={getPaneBackgroundStyle(paneName, gridContentRange, theme.grid.gap)}
        />
      )}
      <PaneGridContent range={gridContentRange} getCellOffset={getCellOffset} />
      <PartialHighlight
        highlightRange={{ startRowIdx: 0, endRowIdx: 50, startColIdx: 0, endColIdx: 1 }}
        parentPaneName={paneName}
        parentPaneRange={gridContentRange}
        border={{ color: "lawngreen", style: "solid", width: "4px" }}
        getCellOffset={getCellOffset}
      />
      <PartialHighlight
        highlightRange={{ startRowIdx: 8, endRowIdx: 9, startColIdx: 0, endColIdx: 40 }}
        parentPaneName={paneName}
        parentPaneRange={gridContentRange}
        border={{ color: "cornflowerblue", style: "solid", width: "4px" }}
        getCellOffset={getCellOffset}
      />
      <PartialHighlight
        highlightRange={{ startRowIdx: 1, endRowIdx: 4, startColIdx: 2, endColIdx: 5 }}
        parentPaneName={paneName}
        parentPaneRange={gridContentRange}
        border={{ color: "red", style: "solid", width: "4px" }}
        getCellOffset={getCellOffset}
      />
      <PartialHighlight
        highlightRange={{ startRowIdx: 1, endRowIdx: 2, startColIdx: 7, endColIdx: 10 }}
        parentPaneName={paneName}
        parentPaneRange={gridContentRange}
        border={{ color: "teal", style: "solid", width: "4px" }}
        getCellOffset={getCellOffset}
      />
      <PartialHighlight
        highlightRange={{ startRowIdx: 5, endRowIdx: 7, startColIdx: 5, endColIdx: 8 }}
        parentPaneName={paneName}
        parentPaneRange={gridContentRange}
        border={{ color: "goldenrod", style: "solid", width: "4px" }}
        getCellOffset={getCellOffset}
      />
      <PartialHighlight
        highlightRange={{ startRowIdx: 1, endRowIdx: 4, startColIdx: 36, endColIdx: 39 }}
        parentPaneName={paneName}
        parentPaneRange={gridContentRange}
        border={{ color: "green", style: "solid", width: "24px" }}
        getCellOffset={getCellOffset}
      />
      <PartialHighlight
        highlightRange={{ startRowIdx: 46, endRowIdx: 49, startColIdx: 2, endColIdx: 5 }}
        parentPaneName={paneName}
        parentPaneRange={gridContentRange}
        border={{ color: "blue", style: "solid", width: "4px" }}
        getCellOffset={getCellOffset}
      />
      <PartialHighlight
        highlightRange={{ startRowIdx: 46, endRowIdx: 49, startColIdx: 36, endColIdx: 39 }}
        parentPaneName={paneName}
        parentPaneRange={gridContentRange}
        border={{ color: "magenta", style: "solid", width: "4px" }}
        getCellOffset={getCellOffset}
      />
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
