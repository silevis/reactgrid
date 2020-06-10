import * as React from 'react';
import { State } from '../Model';
import { CellRendererProps } from './CellRenderer';
export interface PanesProps<TState extends State = State> {
    state: TState;
    cellRenderer: React.FunctionComponent<CellRendererProps>;
}
export declare const PanesRenderer: React.FunctionComponent<PanesProps>;
