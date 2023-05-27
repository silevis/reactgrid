import * as React from 'react';
import { Borders, Location } from '../Model/InternalModel';
import { Range } from '../Model/Range';
import { Cell, Compatible } from '../Model/PublicModel';
import { State } from '../Model/State';
export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;
    range: Range;
    update: State['update'];
    currentlyEditedCell: State['currentlyEditedCell'];
    children?: React.ReactNode;
}
export interface CellRendererChildProps<TState extends State = State> {
    location?: Location;
    cell?: Compatible<Cell>;
    state?: TState;
}
export declare const CellRenderer: React.FC<CellRendererProps>;
