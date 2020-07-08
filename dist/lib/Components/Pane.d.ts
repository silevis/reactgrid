import * as React from 'react';
import { Range, Borders, State } from '../Model';
import { CellRendererProps } from './CellRenderer';
export interface PaneProps {
    renderChildren: boolean;
    style: React.CSSProperties;
    className: string;
}
export interface PaneContentProps<TState extends State = State> {
    state: TState;
    range: () => Range;
    borders: Borders;
    cellRenderer: React.FunctionComponent<CellRendererProps>;
    children?: React.ReactNode;
}
export interface PaneContentChild<TState extends State = State> {
    state: TState;
    calculatedRange?: Range;
}
export declare const Pane: React.FunctionComponent<PaneProps>;
export declare const PaneContent: React.FunctionComponent<PaneContentProps<State>>;
