import React, { useEffect, useRef } from 'react'
import { CellMap, Column, Row } from '../types/PublicModel';
import { useTheme } from '../utils/useTheme';
import { useReactGridStore } from '../utils/reactGridStore';
import { useReactGridId } from './ReactGridIdProvider';
import { NumericalRange } from '../types/CellMatrix';
import { CellContextProvider } from './CellContext';

export interface PaneProps {
  renderChildren: boolean;
  children: React.ReactNode;
  style: React.CSSProperties;
  className: string;
}

interface PaneGridContentProps {
  // rows: Row[];
  // columns: Column[];
  // cells: CellMap;
  range: NumericalRange;
  style?: React.CSSProperties;
}

export interface PaneContentProps {
}

const shouldMemoPaneGridContent = (prevProps: PaneGridContentProps, nextProps: PaneGridContentProps) => {
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
    prevEndColIdx !== nextEndColIdx
  ) {
    return false;
  }

  return true;
};

export const PaneGridContent: React.NamedExoticComponent<PaneGridContentProps> = React.memo(({ range, style }) => {
  const theme = useTheme();
  const { startRowIdx, endRowIdx, startColIdx, endColIdx } = range;
  // const cellWidths = columns.map(({ width }) => width);
  // const cellHeights = rows.map(({ height }) => height);
  // const totalWidth = cellWidths.reduce((acc, curr) => acc + curr, 0);
  // const totalHeight = cellHeights.reduce((acc, curr) => acc + curr, 0);
  const id = useReactGridId();
  const rows = useReactGridStore(id, store => store.rows);
  const columns = useReactGridStore(id, store => store.columns);
  const cells = useReactGridStore(id, store => store.cells);
  const measurements = useReactGridStore(id, store => store.measurements);
  const setMeasurements = useReactGridStore(id, store => store.setMeasurements);

  useEffect(() => {
    // console.log('PaneGridContent', rows, columns, cells);
    const pane = document.querySelector('.rgPaneGridContent');
    if (pane) {
      setMeasurements({
        ...measurements,
        totalWidth: pane.scrollWidth,
        totalHeight: pane.scrollHeight,
      })
    }
  }, [rows, columns, cells, setMeasurements]);

  return (
    <div
      className='rgPaneGridContent'
      style={{
        display: "grid",
        // width: totalWidth,
        // height: totalHeight,
        gridTemplateColumns: theme.grid.templates.columns({
          amount: columns.length,
          widths: columns.map(({ width }) => width),
        }),
        gridTemplateRows: theme.grid.templates.rows({
          amount: rows.length,
          heights: rows.map(({ height }) => height),
        }),
        borderWidth: `${theme.grid.border.width} 0 0 ${theme.grid.border.width}`,
        borderStyle: theme.grid.border.style,
        borderColor: theme.grid.border.color,
        gap: theme.grid.gap,
        ...style,
      }}
    >
      {rows.slice(startRowIdx, endRowIdx).map((row, rowIndex) => {
        return columns.slice(startColIdx, endColIdx).map((col, colIndex) => {
          const cell = cells.get(row.id)?.get(col.id);

          if (!cell || row.id === 'labels' && col.id === "labels") return null;

          const { Template, props } = cell;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`rgCellWrapper rgRowId-${rowIndex} rgColId-${colIndex}`}
              style={{
                ...(cell.rowSpan && { gridRowEnd: `span ${cell.rowSpan}` }),
                ...(cell.colSpan && { gridColumnEnd: `span ${cell.colSpan}` }),
                gridRowStart: rowIndex + 1,
                gridColumnStart: colIndex + 1,
                borderWidth: `0 ${theme.cells.border.width} ${theme.cells.border.width} 0`,
                borderStyle: theme.cells.border.style,
                borderColor: theme.cells.border.color,
              }}
            >
              <CellContextProvider value={{ rowId: row.id, colId: col.id }}>
                <Template {...props} />
              </CellContextProvider>
            </div>
          );
        });
      })}
    </div>
  );
}, shouldMemoPaneGridContent); 

export const Pane: React.FC<PaneProps> = ({ className, style, renderChildren, children }) => {
  if (!style.width || !style.height) {
      return null;
  } else {
      return (
        <div className={`rgPane ${className}`} style={style}>
          {renderChildren && children}
        </div>
      );
  }
};

export const PaneContent: React.FC<PaneContentProps> = (props) => {
  // const { state, range, borders, cellRenderer } = props;

  // const calculatedRange = range();

  return (
      <>
          {/* <PaneGridContent  /> */}
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
      </>
  )
}
