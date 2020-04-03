import { State, StateUpdater, PointerEvent } from '../Model';
export declare class PointerEventsController {
    private readonly updateState;
    constructor(updateState: StateUpdater);
    private eventTimestamps;
    private eventLocations;
    private currentIndex;
    private pointerDownLocation?;
    handlePointerDown: (event: PointerEvent, state: State) => State;
    private handlePointerUp;
}
