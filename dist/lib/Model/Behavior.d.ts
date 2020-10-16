import { PointerLocation } from './InternalModel';
import { KeyboardEvent, ClipboardEvent, PointerEvent } from './domEventsTypes';
import { State } from './State';
export declare abstract class Behavior {
    handleKeyDown(event: KeyboardEvent, state: State): State;
    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State;
    handleKeyUp(event: KeyboardEvent, state: State): State;
    handleCopy(event: ClipboardEvent, state: State): State;
    handlePaste(event: ClipboardEvent, state: State): State;
    handleCut(event: ClipboardEvent, state: State): State;
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handleDoubleClick(event: PointerEvent, location: PointerLocation, state: State): State;
}
