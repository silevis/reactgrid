import * as React from 'react';
import { State, Borders, Location } from '../Model';
export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;
}
export declare const CellRenderer: React.FunctionComponent<CellRendererProps>;
