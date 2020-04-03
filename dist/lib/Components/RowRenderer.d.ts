import * as React from 'react';
import { State, GridRow, GridColumn, Borders } from '../Model';
export interface RowRendererProps {
    state: State;
    row: GridRow;
    columns: GridColumn[];
    forceUpdate: boolean;
    borders: Borders;
}
export declare class RowRenderer extends React.Component<RowRendererProps, {}> {
    shouldComponentUpdate(nextProps: RowRendererProps): boolean;
    render(): JSX.Element[];
}
