import { Direction, PointerLocation } from '../../core';
import { PointerEvent } from '../Model/domEventsTypes';
import { Behavior } from '../Model/Behavior';
import { State } from '../Model/State';
export declare class ColumnReorderBehavior extends Behavior {
    private initialColumnIdx;
    private lastPossibleDropLocation?;
    private pointerOffset;
    private selectedIdxs;
    autoScrollDirection: Direction;
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State;
    getShadowPosition(location: PointerLocation, state: State): number;
    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State;
    getLastPossibleDropLocation(currentLocation: PointerLocation, state: State): PointerLocation | undefined;
    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State;
    handleContextMenu(event: PointerEvent, state: State): State;
}
