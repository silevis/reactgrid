import { PointerEvent } from './domEventsTypes';
import { getLocationFromClient } from '../Functions/getLocationFromClient';
import { AbstractPointerEventsController, isOnClickableArea, isReadyToHandleEvent } from './AbstractPointerEventsController';
import { State } from './State';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';


export class PointerEventsController extends AbstractPointerEventsController {

    public handlePointerDown = (event: PointerEvent, state: State): State => {
        if (!isReadyToHandleEvent(event) || !isOnClickableArea(event, state))
            return state;
        window.addEventListener('pointerup', this.handlePointerUp as any);
        const currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
        return this.handlePointerDownInternal(event, currentLocation, state);
    };

    private handlePointerUp = (event: PointerEvent): void => {
        if (event.button !== 0 && event.button !== undefined) return;
        window.removeEventListener('pointerup', this.handlePointerUp as any);
        this.updateState(state => {
            const currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
            const currentTimestamp = new Date().valueOf();
            const secondLastTimestamp = this.eventTimestamps[1 - this.currentIndex];
            state = state.currentBehavior.handlePointerUp(event, currentLocation, state);
            if (this.shouldHandleCellSelectionOnMobile(event, currentLocation, currentTimestamp)) {
                state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
            }
            state = { ...state, currentBehavior: new DefaultBehavior() };
            if (this.shouldHandleDoubleClick(currentLocation, currentTimestamp, secondLastTimestamp)) {
                state = state.currentBehavior.handleDoubleClick(event, currentLocation, state);
            }
            state.hiddenFocusElement?.focus({ preventScroll: true });
            return state;
        });
    };

}