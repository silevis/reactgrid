import * as React from 'react';
import { State, GridRow, GridColumn, Borders } from '../Model';
import { CellRendererProps } from './CellRenderer';

export interface RowRendererProps {
    state: State;
    row: GridRow;
    columns: GridColumn[];
    forceUpdate: boolean;
    borders: Borders;	
    cellRenderer: React.FunctionComponent<CellRendererProps>;
}

export class RowRenderer extends React.Component<RowRendererProps> {
    shouldComponentUpdate(nextProps: RowRendererProps) {
        const { columns } = this.props;
        return nextProps.forceUpdate
            || nextProps.columns[0].idx !== columns[0].idx || nextProps.columns.length !== columns.length
            || nextProps.columns[nextProps.columns.length - 1].idx !== columns[columns.length - 1].idx;
    }

    render() {
        const { columns, row, cellRenderer, borders, state } = this.props;
        const lastColIdx = columns[columns.length - 1].idx;	
        const CellRenderer = cellRenderer;
        return columns.map(column => <CellRenderer
            key={row.idx + '-' + column.idx}
            borders={{	
                ...borders,	
                left: borders.left && column.left === 0,	
                right: borders.right && column.idx === lastColIdx	
            }}
            state={state}
            location={{ row, column }} />);
    }
}
