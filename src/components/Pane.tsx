import React, { useEffect } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { useReactGridStore } from "../utils/reactGridStore";
import { useTheme } from "../utils/useTheme";
import { CellWrapper } from "./CellWrapper";
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
  ) => { top?: number; right?: number; bottom?: number; left?: number };
}

interface PaneProps {
  className: string;
  style?: React.CSSProperties;

  gridContentRange: NumericalRange;
  getCellOffset?: (
    rowIdx: number,
    colIdx: number,
    rowSpan: number,
    colSpan: number
  ) => { top?: number; right?: number; bottom?: number; left?: number };
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
          className={`rgRowIdx-${realRowIndex} rgColIdx-${realColumnIndex}`}
          style={{
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
          }}
          rowId={row.id}
          colId={col.id}
          realRowIndex={realRowIndex}
          realColumnIndex={realColumnIndex}
          isFocused={isFocused}
          isInEditMode={isInEditMode}
        >
          <Template {...props} />
        </CellWrapper>
      );
    });
  });
};

export const Pane: React.FC<PaneProps> = ({
  className,
  style,
  gridContentRange,
  getCellOffset,
}) => {
  // const { state, range, borders, cellRenderer } = props;

  return (
    <div
      className={`rgPane ${className}`}
      style={{ display: "contents", ...style }}
    >
      <PaneGridContent range={gridContentRange} getCellOffset={getCellOffset} />
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
