import { State, PointerEvent } from '.';
import { AbstractPointerEventsController } from '../Model/AbstractPointerEventsController';
export declare class PointerEventsController extends AbstractPointerEventsController {
    handlePointerDown: (event: PointerEvent, state: State) => State;
    private handlePointerUp;
}
