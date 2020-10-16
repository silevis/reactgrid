import * as React from 'react';
import { Borders } from '../Model/InternalModel';
import { Cell, Compatible } from '../Model/PublicModel';
import { State } from '../Model/State';
import { Location } from '../Model/InternalModel';
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
