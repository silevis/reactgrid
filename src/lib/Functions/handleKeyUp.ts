import { KeyboardEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
import { keyCodes } from './keyCodes';

export function handleKeyUp(event: KeyboardEvent, state: State): State {
    if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
        event.preventDefault();
        event.stopPropagation();
    }
    return state;
}