import * as React from 'react';
import { State, Location, Compatible, Cell, Borders } from '../Model';
export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;
    children?: React.ReactNode;
}
export interface CellRendererChildProps<TState extends State = State> {
    location?: Location;
    cell?: Compatible<Cell>;
    state?: TState;
}
export declare const CellRenderer: React.FC<CellRendererProps>;
