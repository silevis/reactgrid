import { PointerLocation, Location } from "../../core";
import { KeyboardEvent, ClipboardEvent, PointerEvent } from "../Model/domEventsTypes";
import { Behavior } from "../Model/Behavior";
import { State } from "../Model/State";
export declare class DefaultBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    private getNewBehavior;
    handleContextMenu(event: PointerEvent, state: State): State;
    handleDoubleClick(event: PointerEvent, location: Location, state: State): State;
    handleKeyDown(event: KeyboardEvent, state: State): State;
    handleKeyUp(event: KeyboardEvent, state: State): State;
    handleCompositionEnd(event: CompositionEvent, state: State): State;
    handleCopy(event: ClipboardEvent, state: State): State;
    handlePaste(event: ClipboardEvent, state: State): State;
    handleCut(event: ClipboardEvent, state: State): State;
}
