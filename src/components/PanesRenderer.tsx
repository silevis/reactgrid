import React, { FC, useEffect } from 'react'
import { PaneGridContent } from './Pane';
import { Row, Column, CellMap } from '../types/PublicModel';
import { useReactGridId } from './ReactGridIdProvider';
import { useReactGridStore } from '../utils/reactGridStore';
import { GridColumn, GridRow } from '../types/CellMatrix';

type NumericalRange = {
  startRowIdx: number,
  endRowIdx: number,
  startColIdx: number,
  endColIdx: number
};

interface PaneGridContentProps {
  rows: ReadonlyArray<Row>;
  columns: ReadonlyArray<Column>;
  cells: CellMap;
  range: NumericalRange;
  style?: React.CSSProperties;
}

const PanesRenderer: FC<PaneGridContentProps> = ({ range }) => {
  // const observer = React.useRef<ResizeObserver>();
  const id = useReactGridId();
  const visibleRange = useReactGridStore(id, store => store.visibleRange);
  // console.log('PanesRenderer', rows, columns, cells);

  return (
    <div>
      <PaneGridContent 
        // rows={rows}
        // columns={columns}
        // cells={cells}
        range={{
          ...range,
          // startRowIdx: 0,
          // endRowIdx: 3,
          // startColIdx: 0,
          // endColIdx: 3,
        }}
      />
    </div>
  )
}

export default PanesRenderer;
