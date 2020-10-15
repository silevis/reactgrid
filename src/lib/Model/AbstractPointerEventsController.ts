import { areLocationsEqual } from '../Functions/areLocationsEqual';
import { PointerLocation, Location } from './InternalModel';
import { State, StateUpdater } from './State';
import { PointerEvent } from './domEventsTypes';


export abstract class AbstractPointerEventsController {

    constructor(readonly updateState: StateUpdater) { }

    eventTimestamps: [number, number] = [0, 0];
    eventLocations: Array<Location | undefined> = [undefined, undefined];
    currentIndex: number = 0;
    pointerDownLocation?: Location;

    abstract handlePointerDown: (event: PointerEvent, state: State) => State;

    protected handlePointerDownInternal(event: PointerEvent, currentLocation: PointerLocation, state: State): State {
        this.pointerDownLocation = currentLocation;
        const previousLocation = this.eventLocations[this.currentIndex];
        this.currentIndex = 1 - this.currentIndex;
        this.eventTimestamps[this.currentIndex] = new Date().valueOf();
        this.eventLocations[this.currentIndex] = currentLocation;
        const isFirstRowOrColumn = currentLocation.row.idx === 0 || currentLocation.column.idx === 0;
        if (event.pointerType === 'mouse' || isFirstRowOrColumn || areLocationsEqual(currentLocation, previousLocation)) {
            state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
        }
        return state;
    }

    protected shouldHandleDoubleClick(currentLocation: PointerLocation, currentTimestamp: number, secondLastTimestamp: number) {
        return currentTimestamp - secondLastTimestamp < 500
            && areLocationsEqual(currentLocation, this.eventLocations[0])
            && areLocationsEqual(currentLocation, this.eventLocations[1]);
    }

    protected shouldHandleCellSelectionOnMobile(event: PointerEvent, currentLocation: PointerLocation, currentTimestamp: number): boolean {
        // prevent from cell selection on first click on mobile devices
        return event.pointerType !== 'mouse' &&
            areLocationsEqual(currentLocation, this.pointerDownLocation) &&
            event.pointerType !== undefined && // !== undefined only for cypress tests
            currentTimestamp - this.eventTimestamps[this.currentIndex] < 500 &&
            (currentLocation.row.idx > 0 && currentLocation.column.idx > 0)
    }

}

// TODO think about create as saparate function
export function isReadyToHandleEvent(event: PointerEvent): boolean {
    if ((event.button !== 0 && event.button !== undefined) ||
        ((event.target as HTMLDivElement).className === 'reactgrid-content' && event.pointerType !== undefined)) {
        return false;
    }
    return true;
}

// TODO think about create as saparate function
export function isOnClickableArea(event: PointerEvent, state: State): boolean {
    const { left } = state.reactGridElement!.getBoundingClientRect();
    const viewportX = event.clientX - left;
    if (viewportX > state.cellMatrix.width) {
        return false;
    }
    return true;
}