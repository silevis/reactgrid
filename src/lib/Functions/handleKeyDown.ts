import { State, KeyboardEvent } from '../Model';
import { focusLocation, keyCodes, tryAppendChange, emptyCell } from '.';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { isSelectionKey } from './isSelectionKey';

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
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    if (cellTemplate.handleKeyDown && !state.currentlyEditedCell) { // TODO need add !(event.shiftKey && event.keyCode === keyCodes.SPACE) to working keycodes (shift + space) in a lower condition
        const { cell: newCell, enableEditMode } = cellTemplate.handleKeyDown(cell, event.keyCode, event.ctrlKey || event.metaKey, event.shiftKey, event.altKey);
        if (JSON.stringify(newCell) !== JSON.stringify(cell) || enableEditMode) {
            if (enableEditMode) {
                return { ...state, currentlyEditedCell: newCell }
            } else {
                return tryAppendChange(state, location, newCell);
            }
        }
    }

    if (event.altKey)
        return state;

    if (event.shiftKey) {
        switch (event.keyCode) {
            case keyCodes.TAB:
                event.preventDefault(); // prevent from leaving HFE
                return moveFocusLeft(state);
            case keyCodes.ENTER:
                state.hiddenFocusElement.focus();
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
                state.hiddenFocusElement.focus();
                return wipeSelectedRanges(state);
            case keyCodes.UP_ARROW:
                state.hiddenFocusElement.focus();
                return moveFocusUp(state);
            case keyCodes.DOWN_ARROW:
                state.hiddenFocusElement.focus();
                return moveFocusDown(state);
            case keyCodes.LEFT_ARROW:
                state.hiddenFocusElement.focus();
                return moveFocusLeft(state);
            case keyCodes.RIGHT_ARROW:
                state.hiddenFocusElement.focus();
                return moveFocusRight(state);
            case keyCodes.TAB:
                state.hiddenFocusElement.focus();
                event.preventDefault(); // prevent from leaving HFE
                return moveFocusRight(state);
            case keyCodes.HOME:
                state.hiddenFocusElement.focus();
                return state.focusedLocation ? focusCell(0, state.focusedLocation.row.idx, state) : state;
            case keyCodes.END:
                state.hiddenFocusElement.focus();
                return state.focusedLocation ? focusCell(state.cellMatrix.columns.length - 1, state.focusedLocation.row.idx, state) : state;
            case keyCodes.PAGE_UP:
                state.hiddenFocusElement.focus();
                return moveFocusPageUp(state);
            case keyCodes.PAGE_DOWN:
                state.hiddenFocusElement.focus();
                return moveFocusPageDown(state);
            case keyCodes.ENTER:
                state.hiddenFocusElement.focus();
                return { ...moveFocusDown(state), currentlyEditedCell: undefined };
            case keyCodes.ESCAPE:
                event.preventDefault();
                state.hiddenFocusElement.focus();
                return (state.currentlyEditedCell) ? { ...state, currentlyEditedCell: undefined } : state
        }
    }
    return state;

}

// TODO this should be rewritten, not working propely
function moveFocusPageUp(state: State): State {
    if (!state.focusedLocation)
        return state;
    const rowsOnScreen = state.cellMatrix.rows.filter(
        row => row.top < state.reactGridElement.clientHeight // TODO check this line
    );
    return focusCell(
        state.focusedLocation.column.idx,
        state.focusedLocation.row.idx - rowsOnScreen.length > 0
            ? state.focusedLocation.row.idx - rowsOnScreen.length
            : 0, state
    );
}


// TODO this should be rewritten, not working propely
function moveFocusPageDown(state: State): State {
    if (!state.focusedLocation)
        return state;
    const rowsOnScreen = state.cellMatrix.rows
        .slice(state.cellMatrix.stickyTopRange.rows.length, state.cellMatrix.rows.length)
        .filter(row => row.top + row.height < state.reactGridElement.clientHeight);
    return focusCell(
        state.focusedLocation.column.idx,
        state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
            ? state.focusedLocation.row.idx + rowsOnScreen.length
            : state.cellMatrix.rows.length - 1, state
    );
}

function wipeSelectedRanges(state: State): State {
    const location = state.focusedLocation;
    return location ? tryAppendChange(state, { row: location.row, column: location.column }, emptyCell) : state;
}

export function focusCell(colIdx: number, rowIdx: number, state: State): State {
    const location = state.cellMatrix.getLocation(rowIdx, colIdx);
    return focusLocation(state, location);
}

export function moveFocusLeft(state: State): State {
    return (state.focusedLocation && state.focusedLocation.column.idx > 0) ?
        focusCell(state.focusedLocation.column.idx - 1, state.focusedLocation.row.idx, state) : state;
}

export function moveFocusRight(state: State): State {
    return (state.focusedLocation && state.focusedLocation.column.idx < state.cellMatrix.last.column.idx) ?
        focusCell(state.focusedLocation.column.idx + 1, state.focusedLocation.row.idx, state) : state;
}

export function moveFocusUp(state: State): State {
    return (state.focusedLocation && state.focusedLocation.row.idx > 0) ?
        focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx - 1, state) : state;
}

export function moveFocusDown(state: State): State {
    if (state.focusedLocation) {
        if (state.focusedLocation.row.idx === state.cellMatrix.last.row.idx)
            return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx, state)
        return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx + 1, state)
    }
    return state;
} 