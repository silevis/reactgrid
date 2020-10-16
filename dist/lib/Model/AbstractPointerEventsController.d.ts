import { PointerLocation, Location } from './InternalModel';
import { State, StateUpdater } from './State';
import { PointerEvent } from './domEventsTypes';
export declare abstract class AbstractPointerEventsController {
    readonly updateState: StateUpdater;
    constructor(updateState: StateUpdater);
    eventTimestamps: [number, number];
    eventLocations: Array<Location | undefined>;
    currentIndex: number;
    pointerDownLocation?: Location;
    abstract handlePointerDown: (event: PointerEvent, state: State) => State;
    protected handlePointerDownInternal(event: PointerEvent, currentLocation: PointerLocation, state: State): State;
    protected shouldHandleDoubleClick(currentLocation: PointerLocation, currentTimestamp: number, secondLastTimestamp: number): boolean;
    protected shouldHandleCellSelectionOnMobile(event: PointerEvent, currentLocation: PointerLocation, currentTimestamp: number): boolean;
}
export declare function isReadyToHandleEvent(event: PointerEvent): boolean;
export declare function isOnClickableArea(event: PointerEvent, state: State): boolean;
