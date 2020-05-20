import * as React from 'react';
import { State, Location, CellMatrix } from '../Model';
export interface CellEditorOffset {
    top: number;
    left: number;
}
export interface CellEditorRendererProps {
    state: State;
    positionCalculator: (options: PositionState) => any;
}
export interface PositionState<TState extends State = State> {
    state: TState;
    location: Location;
}
export declare const CellEditorRenderer: React.FunctionComponent<CellEditorRendererProps>;
export declare function getStickyLeftRangeWidth(cellMatrix: CellMatrix, location: Location): number | undefined;
export declare function getStickyTopRangeWidth(cellMatrix: CellMatrix, location: Location): number | undefined;
export declare function getLeftStickyOffset(cellMatrix: CellMatrix, location: Location, state: State): number | undefined;
export declare function getTopStickyOffset(cellMatrix: CellMatrix, location: Location, state: State): number | undefined;
export declare const cellEditorCalculator: (options: PositionState) => CellEditorOffset;
