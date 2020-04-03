import * as React from 'react';
import { State, GridRow, GridColumn, Borders } from '../Model';
import { CellRenderer } from './CellRenderer';

export interface RowRendererProps {
    state: State;
    row: GridRow;
    columns: GridColumn[];
    forceUpdate: boolean;
    borders: Borders;
}

export class RowRenderer extends React.Component<RowRendererProps, {}> {
    shouldComponentUpdate(nextProps: RowRendererProps) {
        return nextProps.forceUpdate || nextProps.columns[0].idx !== this.props.columns[0].idx || nextProps.columns.length !== this.props.columns.length;
    }

    render() {
        const lastColIdx = this.props.columns[this.props.columns.length - 1].idx;
        return this.props.columns.map(column => <CellRenderer
            key={this.props.row.idx + '-' + column.idx}
            borders={{ ...this.props.borders, left: this.props.borders.left && column.left === 0, right: this.props.borders.right && column.idx === lastColIdx }}
            state={this.props.state}
            location={{ row: this.props.row, column }} />);
    }
}
