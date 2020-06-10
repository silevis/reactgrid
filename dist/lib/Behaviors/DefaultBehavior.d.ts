import { State, Behavior, KeyboardEvent, ClipboardEvent, PointerEvent, Location, PointerLocation } from "../Model";
export declare class DefaultBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handleDoubleClick(event: PointerEvent, location: Location, state: State): State;
    handleKeyDown(event: KeyboardEvent, state: State): State;
    handleKeyUp(event: KeyboardEvent, state: State): State;
    handleCopy(event: ClipboardEvent, state: State): State;
    handlePaste(event: ClipboardEvent, state: State): State;
    handleCut(event: ClipboardEvent, state: State): State;
}
