import { State, Behavior, KeyboardEvent, ClipboardEvent, PointerEvent, Location, PointerLocation } from '../Model';
import { handleKeyDown, handleKeyUp, handlePaste, handleCopy, handleDoubleClick } from '../Functions';
import { CellSelectionBehavior } from './CellSelectionBehavior';

export class DefaultBehavior extends Behavior {

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        state = { ...state, currentBehavior: new CellSelectionBehavior() };
        return state.currentBehavior.handlePointerDown(event, location, state);
    }

    handleDoubleClick(event: PointerEvent, location: Location, state: State): State {
        return handleDoubleClick(event, location, state);
    }

    handleKeyDown(event: KeyboardEvent, state: State): State {
        return handleKeyDown(state, event);
    }

    handleKeyUp(event: KeyboardEvent, state: State): State {
        return handleKeyUp(event, state);
    }

    handleCopy(event: ClipboardEvent, state: State): State {
        return handleCopy(event, state);
    }

    handlePaste(event: ClipboardEvent, state: State): State {
        return handlePaste(event, state);
    }

    handleCut(event: ClipboardEvent, state: State): State {
        return handleCopy(event, state, true);
    }

}