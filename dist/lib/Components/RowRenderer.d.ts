import * as React from 'react';
import { State, GridRow, GridColumn, Borders } from '../Model';
import { CellRendererProps } from './CellRenderer';
export interface RowRendererProps {
    state: State;
    row: GridRow;
    columns: GridColumn[];
    forceUpdate: boolean;
    borders: Borders;
    cellRenderer: React.FC<CellRendererProps>;
}
export declare const RowRenderer: React.NamedExoticComponent<RowRendererProps>;
