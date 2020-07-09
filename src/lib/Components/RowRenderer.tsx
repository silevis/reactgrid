import * as React from 'react';
import { State, GridRow, GridColumn } from '../Model';
import { CellRendererProps } from './CellRenderer';

export interface RowRendererProps {
    state: State;
    row: GridRow;
    columns: GridColumn[];
    forceUpdate: boolean;
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
        const { columns, row, cellRenderer, state } = this.props;
        const CellRenderer = cellRenderer;
        return columns.map(column => <CellRenderer
            key={row.idx + '-' + column.idx}
            state={state}
            location={{ row, column }} />);
    }
}
