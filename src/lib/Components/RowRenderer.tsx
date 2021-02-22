import * as React from 'react';
import { translateLocationIdxToLookupKey } from '../Model/CellMatrix';
import { GridRow, GridColumn, Borders, Location } from '../Model/InternalModel';
import { State } from '../Model/State';
import { CellRendererProps } from './CellRenderer';

export interface RowRendererProps {
    state: State;
    row: GridRow;
    columns: GridColumn[];
    forceUpdate: boolean;
    borders: Borders;
    cellRenderer: React.FC<CellRendererProps>;
}

function shouldMemoRowRenderer(prevProps: RowRendererProps, nextProps: RowRendererProps): boolean {
    const { columns: prevCols } = prevProps;
    const { columns: nextCols, forceUpdate } = nextProps;
    return !(forceUpdate
        || nextCols[0].idx !== prevCols[0].idx || nextCols.length !== prevCols.length
        || nextCols[nextCols.length - 1].idx !== prevCols[prevCols.length - 1].idx);
}

const MappedColumns: React.FC<RowRendererProps> = ({ columns, row, cellRenderer, borders, state }) => {
    const lastColIdx = columns[columns.length - 1].idx;
    const CellRenderer = cellRenderer;
    return (
        <>
            {columns.map(column => {
                const range = state.cellMatrix.rangesToRender[translateLocationIdxToLookupKey(column.idx, row.idx)]?.range;
                if (!range) {
                    return null;
                }
                const location: Location = { row, column };
                return <CellRenderer
                    key={row.idx + '-' + column.idx}
                    borders={{
                        ...borders,
                        left: borders.left && column.left === 0,
                        right: (borders.right && column.idx === lastColIdx) || !(state.cellMatrix.scrollableRange.last.column.idx === location.column.idx)
                    }}
                    state={state}
                    location={location}
                    range={range}
                />
            })}
        </>
    );
};

export const RowRenderer: React.NamedExoticComponent<RowRendererProps> = React.memo(MappedColumns, shouldMemoRowRenderer);

RowRenderer.displayName = 'RowRenderer';
