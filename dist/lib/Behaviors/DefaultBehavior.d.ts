import { Behavior } from '../Model/Behavior';
import { PointerLocation } from '../Model/InternalModel';
import { State } from '../Model/State';
import { PointerEvent, KeyboardEvent, ClipboardEvent } from '../Model/domEventsTypes';
import { Location } from '../Model/InternalModel';
export declare class DefaultBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handleDoubleClick(event: PointerEvent, location: Location, state: State): State;
    handleKeyDown(event: KeyboardEvent, state: State): State;
    handleKeyUp(event: KeyboardEvent, state: State): State;
    handleCopy(event: ClipboardEvent, state: State): State;
    handlePaste(event: ClipboardEvent, state: State): State;
    handleCut(event: ClipboardEvent, state: State): State;
}
