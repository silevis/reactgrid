import { State, KeyboardEvent } from '../Model';
import { focusLocation, keyCodes } from '.';
import { isSelectionKey } from './isSelectionKey';
import { focusCell, moveFocusUp, moveFocusDown, moveFocusLeft, moveFocusRight, moveFocusPageDown, moveFocusPageUp } from '../Functions/focuses';
import { wipeSelectedRanges } from './wipeSelectedRanges';
import { handleKeyDownOnCellTemplate } from './handleKeyDownOnCellTemplate';

export function handleKeyDown(state: State, event: KeyboardEvent): State {
    const newState = handleKeyDownInternal(state, event);
    if (newState !== state) { event.stopPropagation(); event.preventDefault(); }
    return newState;
}

function handleKeyDownInternal(state: State, event: KeyboardEvent): State {
    const location = state.focusedLocation;
    if (!location) {
        return state;
    }

    let newState = handleKeyDownOnCellTemplate(state, event);
    if (newState !== state) {
        return newState;
    }

    if (event.altKey)
        return state;

    if (event.shiftKey) {

        switch (event.keyCode) {
            case keyCodes.TAB:
                event.preventDefault(); // prevent from leaving HFE
                return moveFocusLeft(state);
            case keyCodes.ENTER:
                state.hiddenFocusElement?.focus();
                return moveFocusUp(state);
        }

    } else if (isSelectionKey(event)) {

        switch (event.keyCode) {
            case keyCodes.HOME:
                return focusLocation(state, state.cellMatrix.first);
            case keyCodes.END:
                return focusLocation(state, state.cellMatrix.last);
        }

    } else {
        // === NO SHIFT OR CONTROL ===
        switch (event.keyCode) {
            case keyCodes.DELETE:
            case keyCodes.BACKSPACE:
                state.hiddenFocusElement?.focus();
                return wipeSelectedRanges(state);
            case keyCodes.UP_ARROW:
                state.hiddenFocusElement?.focus();
                return moveFocusUp(state);
            case keyCodes.DOWN_ARROW:
                state.hiddenFocusElement?.focus();
                return moveFocusDown(state);
            case keyCodes.LEFT_ARROW:
                state.hiddenFocusElement?.focus();
                return moveFocusLeft(state);
            case keyCodes.RIGHT_ARROW:
                state.hiddenFocusElement?.focus();
                return moveFocusRight(state);
            case keyCodes.TAB:
                state.hiddenFocusElement?.focus();
                event.preventDefault(); // prevent from leaving HFE
                return moveFocusRight(state);
            case keyCodes.HOME:
                state.hiddenFocusElement?.focus();
                return state.focusedLocation ? focusCell(0, state.focusedLocation.row.idx, state) : state;
            case keyCodes.END:
                state.hiddenFocusElement?.focus();
                return state.focusedLocation ? focusCell(state.cellMatrix.columns.length - 1, state.focusedLocation.row.idx, state) : state;
            case keyCodes.PAGE_UP:
                state.hiddenFocusElement?.focus();
                return moveFocusPageUp(state);
            case keyCodes.PAGE_DOWN:
                state.hiddenFocusElement?.focus();
                return moveFocusPageDown(state);
            case keyCodes.ENTER:
                state.hiddenFocusElement?.focus();
                return { ...moveFocusDown(state), currentlyEditedCell: undefined };
            case keyCodes.ESCAPE:
                event.preventDefault();
                state.hiddenFocusElement?.focus();
                return (state.currentlyEditedCell) ? { ...state, currentlyEditedCell: undefined } : state
        }
    }
    return state;

}
