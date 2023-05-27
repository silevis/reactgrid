/// <reference types="react" />
import { Direction, PointerLocation } from './InternalModel';
import { KeyboardEvent, ClipboardEvent, PointerEvent } from './domEventsTypes';
import { State } from './State';
import { Range } from './Range';
export declare abstract class Behavior<PointerUpEvent = PointerEvent | MouseEvent> {
    handleKeyDown(event: KeyboardEvent, state: State): State;
    handlePointerUp(event: PointerUpEvent, location: PointerLocation, state: State): State;
    handleKeyUp(event: KeyboardEvent, state: State): State;
    handleCopy(event: ClipboardEvent, state: State): State;
    handlePaste(event: ClipboardEvent, state: State): State;
    handleCut(event: ClipboardEvent, state: State): State;
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handleDoubleClick(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State;
    handleContextMenu(event: PointerEvent | MouseEvent, state: State): State;
    renderPanePart(state: State, pane: Range): React.ReactNode;
    autoScrollDirection: Direction;
}
