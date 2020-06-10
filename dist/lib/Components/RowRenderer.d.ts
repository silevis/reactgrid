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
export declare class RowRenderer extends React.Component<RowRendererProps> {
    shouldComponentUpdate(nextProps: RowRendererProps): boolean;
    render(): JSX.Element[];
}
