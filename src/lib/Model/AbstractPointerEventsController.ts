import { StateUpdater, Location, PointerLocation } from '.';
import { State, PointerEvent } from '.';
import { areLocationsEqual } from '../Functions/areLocationsEqual';
import { isMacOs } from '../Functions/operatingSystem';
import { getLocationFromClient } from '../Functions';
import { Behavior } from './Behavior';

export abstract class AbstractPointerEventsController {

    constructor(readonly updateState: StateUpdater) { }

    eventTimestamps: [number, number] = [0, 0];
    eventLocations: Array<Location | undefined> = [undefined, undefined];
    currentIndex: number = 0;
    pointerDownLocation?: Location;

    abstract handlePointerDown: (event: PointerEvent, state: State) => State;

    // TODO use as function only???
    protected isReadyToHandleEvent = (event: PointerEvent, state: State): State => {
        if ((event.button !== 0 && event.button !== undefined) ||
            ((event.target as HTMLDivElement).className === 'reactgrid-content' && event.pointerType !== undefined)) {
            return state;
        }
        return state;
    }

    protected handlePointerDownInternal(event: PointerEvent, currentLocation: PointerLocation, state: State): State {
        this.pointerDownLocation = currentLocation;
        const previousLocation = this.eventLocations[this.currentIndex];
        this.currentIndex = 1 - this.currentIndex;
        this.eventTimestamps[this.currentIndex] = new Date().valueOf();
        this.eventLocations[this.currentIndex] = currentLocation;
        if ((event.pointerType as any) !== 'cypress' && (event.pointerType === 'mouse' || (currentLocation.row.idx === 0 || currentLocation.column.idx === 0)
            || areLocationsEqual(currentLocation, previousLocation) || event.pointerType === undefined)
            && !(event.ctrlKey && isMacOs())
        ) {
            state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
        }
        return state;
    }

    protected handlePointerUpInternal(event: PointerEvent, defaultBehavior: Behavior): void {
        this.updateState(state => {
            const currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
            const currentTimestamp = new Date().valueOf();
            const secondLastTimestamp = this.eventTimestamps[1 - this.currentIndex];
            state = state.currentBehavior.handlePointerUp(event, currentLocation, state);
            // TODO explain this case
            if (
                event.pointerType !== 'mouse' &&
                areLocationsEqual(currentLocation, this.pointerDownLocation) &&
                event.pointerType !== undefined && // !== undefined only for cypress tests
                currentTimestamp - this.eventTimestamps[this.currentIndex] < 500 &&
                (currentLocation.row.idx > 0 && currentLocation.column.idx > 0)
            ) {
                state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
            }
            state = { ...state, currentBehavior: defaultBehavior };
            if (currentTimestamp - secondLastTimestamp < 500 &&
                areLocationsEqual(currentLocation, this.eventLocations[0]) &&
                areLocationsEqual(currentLocation, this.eventLocations[1])) {
                state = state.currentBehavior.handleDoubleClick(event, currentLocation, state);
            }
            if (event.pointerType !== 'mouse' &&
                currentTimestamp - this.eventTimestamps[this.currentIndex] >= 500
                && areLocationsEqual(currentLocation, this.eventLocations[0])
                && areLocationsEqual(currentLocation, this.eventLocations[1])
            ) { }
            state.hiddenFocusElement?.focus();
            return state;
        });
    }

}