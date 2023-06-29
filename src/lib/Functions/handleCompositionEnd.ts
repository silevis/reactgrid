import { KeyboardEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
import { keyCodes } from './keyCodes';
import { handleKeyDown } from "./handleKeyDown";

export function handleCompositionEnd(event: KeyboardEvent, state: State): State {
    if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
        event.preventDefault();
        event.stopPropagation();
    }
    return handleKeyDown(state, event);
}