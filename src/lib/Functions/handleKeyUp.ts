import { State, KeyboardEvent } from '../Model';
import { keyCodes } from '.';

export function handleKeyUp(event: KeyboardEvent, state: State): State {
    if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
        event.preventDefault();
        event.stopPropagation();
    }
    return state;
}