import { State, PointerEvent } from '.';
import { getLocationFromClient } from '../Functions';
import { AbstractPointerEventsController } from '../Model/AbstractPointerEventsController';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';


export class PointerEventsController extends AbstractPointerEventsController {

    public handlePointerDown = (event: PointerEvent, state: State): State => {
        let newState = this.isReadyToHandleEvent(event, state);
        if (state !== newState)
            return newState;
        window.addEventListener('pointerup', this.handlePointerUp as any);
        const currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
        return this.handlePointerDownInternal(event, currentLocation, state);
    };

    private handlePointerUp = (event: PointerEvent): void => {
        if (event.button !== 0 && event.button !== undefined) return;
        window.removeEventListener('pointerup', this.handlePointerUp as any);
        this.handlePointerUpInternal(event, new DefaultBehavior());
    };
}