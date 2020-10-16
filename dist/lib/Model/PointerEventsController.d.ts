import { PointerEvent } from './domEventsTypes';
import { AbstractPointerEventsController } from './AbstractPointerEventsController';
import { State } from './State';
export declare class PointerEventsController extends AbstractPointerEventsController {
    handlePointerDown: (event: PointerEvent, state: State) => State;
    private handlePointerUp;
}
