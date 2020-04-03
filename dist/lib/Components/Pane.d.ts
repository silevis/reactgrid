import * as React from 'react';
import { Range, Borders, State } from '../Model';
export interface PaneProps {
    renderAsFrame: boolean;
    state: State;
    style: React.CSSProperties;
    range: () => Range;
    borders: Borders;
    className: string;
}
export declare const Pane: React.FunctionComponent<PaneProps>;
