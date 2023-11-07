import React, { CSSProperties } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { GetCellOffsets, PaneName } from "../types/InternalModel";
import { useReactGridStore } from "../utils/reactGridStore";
import { useTheme } from "../utils/useTheme";
import { CellWrapper } from "./CellWrapper";
import { useReactGridId } from "./ReactGridIdProvider";
import { RGTheme } from "../types/Theme";
import { css, keyframes } from "@emotion/react";

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
    // ...(css`animation: ${fadeIn} 0.2s ease-in-out`),
    transition: "width 0.2s ease-in-out, height 0.2s ease-in-out"
  };

  if (paneName.startsWith("Top")) {
    style = {
      ...style,
      top: 0,
      height: `calc(100% + 2*${gap.width})`,
      marginTop: `-${gap.width}`,
    };
  }
  if (paneName.endsWith("Right")) {
    style = {
      ...style,
      right: 0,
      width: `calc(100% + 2*${gap.width})`,
      marginLeft: `-${gap.width}`,
    };
  }
  if (paneName.startsWith("Bottom")) {
    style = {
      ...style,
      bottom: 0,
      height: `calc(100% + 2*${gap.width})`,
      marginTop: `-${gap.width}`,
    };
  }
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
const fadeIn = keyframes`
from {
  opacity: 0;
}
to {
  opacity: 1;
}
`;

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
      {paneName === "Center" && (<div className="rgFocusIndicator" style={{
        gridArea: "5 / 5 / 6 / 6",
        // width: "calc(100% + 10px)",
        // height: "calc(100% + 10px)",
        width: "100%",
        height: "100%",
        marginTop: "-4px",
        marginLeft: "-4px",
        // marginRight: "-5px",
        // marginBottom: "-5px",
        // backgroundColor: "aliceblue",
        // opacity: 0.5,
        border: "4px solid blue",
        // pointerEvents: "none",
      }} />)}
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
