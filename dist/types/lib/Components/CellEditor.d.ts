import * as React from 'react';
import { Location } from '../Model/InternalModel';
import { CellMatrix } from '../Model/CellMatrix';
import { State } from '../Model/State';
export interface CellEditorOffset<TState extends State = State> {
    top: number;
    left: number;
    state: TState;
    location: Location;
}
export interface PositionState<TState extends State = State> {
    state: TState;
    location: Location;
}
export declare const CellEditorRenderer: React.FC;
export declare function getStickyLeftRangeWidth(cellMatrix: CellMatrix, location: Location): number | undefined;
export declare function getStickyTopRangeWidth(cellMatrix: CellMatrix, location: Location): number | undefined;
export declare function getLeftStickyOffset(cellMatrix: CellMatrix, location: Location, state: State): number | undefined;
export declare function getTopStickyOffset(cellMatrix: CellMatrix, location: Location, state: State): number | undefined;
export declare const cellEditorCalculator: (options: PositionState) => CellEditorOffset;
