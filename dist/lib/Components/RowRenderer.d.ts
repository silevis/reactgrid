import * as React from 'react';
import { GridRow, GridColumn, Borders } from '../Model/InternalModel';
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
export declare const RowRenderer: React.NamedExoticComponent<RowRendererProps>;
