import * as React from 'react';
import { Range } from '../Model/Range';
import { State } from '../Model/State';
import { Borders } from '../Model/InternalModel';
import { CellRendererProps } from './CellRenderer';
export interface PaneProps {
    renderChildren: boolean;
    style: React.CSSProperties;
    className: string;
}
export interface RowsProps {
    state: State;
    range: Range;
    borders: Borders;
    cellRenderer: React.FC<CellRendererProps>;
}
export interface PaneContentProps<TState extends State = State> {
    state: TState;
    range: () => Range;
    borders: Borders;
    cellRenderer: React.FC<CellRendererProps>;
    children?: (state: TState, range: Range) => React.ReactNode;
}
export declare const PaneGridContent: React.NamedExoticComponent<RowsProps>;
export declare const Pane: React.FC<PaneProps>;
export declare const PaneContent: React.FC<PaneContentProps<State>>;
