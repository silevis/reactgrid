import { PointerEvent } from '../Functions';
import { State, Location, Behavior } from '../Model';
export declare class CellSelectionBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: Location, state: State): State;
}
