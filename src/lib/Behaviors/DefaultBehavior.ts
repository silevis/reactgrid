import { handleCopy } from '../Functions/handleCopy';
import { handleDoubleClick } from '../Functions/handleDoubleClick';
import { handleKeyDown } from '../Functions/handleKeyDown';
import { handleKeyUp } from '../Functions/handleKeyUp';
import { handlePaste } from '../Functions/handlePaste';
import { Behavior } from '../Model/Behavior';
import { PointerLocation } from '../Model/InternalModel';
import { State } from '../Model/State';
import { PointerEvent, KeyboardEvent, ClipboardEvent } from '../Model/domEventsTypes';
import { Location } from '../Model/InternalModel';
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