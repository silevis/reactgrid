import { Behavior } from '../Model/Behavior';
import { State } from '../Model/State';
import { Location } from '../Model/InternalModel';
import { PointerEvent } from '../Model/domEventsTypes';
export declare class CellSelectionBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: Location, state: State): State;
}
