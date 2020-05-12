import { StateUpdater, Location, PointerLocation } from '.';
import { State, PointerEvent } from '.';
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
