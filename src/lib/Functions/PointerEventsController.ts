import { Location, State, StateUpdater, PointerEvent } from '../Model';
import {
    getLocationFromClient,
} from '.';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { areLocationsEqual } from './areLocationsEqual';
import {
    isMacOs,
} from './operatingSystem';

export class PointerEventsController {
    constructor(private readonly updateState: StateUpdater) { }

    // TODO add opportunity to add Handle PointerCancel
    private eventTimestamps: number[] = [0, 0];
    private eventLocations: Array<Location | undefined> = [undefined, undefined];
    private currentIndex: number = 0;
    private pointerDownLocation?: Location;

    public handlePointerDown = (event: PointerEvent, state: State): State => {
        if ((event.button !== 0 && event.button !== undefined) || ((event.target as HTMLDivElement).className === 'reactgrid-content' && event.pointerType !== undefined)) {
            return state;
        }
        window.addEventListener('pointerup', this.handlePointerUp as any);
        const previousLocation = this.eventLocations[this.currentIndex];
        const currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
        this.pointerDownLocation = currentLocation;
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
    };

    private handlePointerUp = (event: PointerEvent): void => {
        if (event.button !== 0 && event.button !== undefined) return;

        this.updateState(state => {
            window.removeEventListener('pointerup', this.handlePointerUp as any);
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
            state = { ...state, currentBehavior: new DefaultBehavior() };
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
            state.hiddenFocusElement.focus();
            return state;
        });
    };
}