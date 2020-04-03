var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { focusLocation, keyCodes, tryAppendChange, emptyCell } from '.';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { isSelectionKey } from './isSelectionKey';
export function handleKeyDown(state, event) {
    var newState = handleKeyDownInternal(state, event);
    if (newState !== state) {
        event.stopPropagation();
        event.preventDefault();
    }
    return newState;
}
function handleKeyDownInternal(state, event) {
    var location = state.focusedLocation;
    if (!location) {
        return state;
    }
    var _a = getCompatibleCellAndTemplate(state, location), cell = _a.cell, cellTemplate = _a.cellTemplate;
    if (cellTemplate.handleKeyDown && !state.currentlyEditedCell) {
        var _b = cellTemplate.handleKeyDown(cell, event.keyCode, event.ctrlKey || event.metaKey, event.shiftKey, event.altKey), newCell = _b.cell, enableEditMode = _b.enableEditMode;
        if (JSON.stringify(newCell) !== JSON.stringify(cell) || enableEditMode) {
            if (enableEditMode) {
                return __assign(__assign({}, state), { currentlyEditedCell: newCell });
            }
            else {
                return tryAppendChange(state, location, newCell);
            }
        }
    }
    if (event.altKey)
        return state;
    if (event.shiftKey) {
        switch (event.keyCode) {
            case keyCodes.TAB:
                event.preventDefault();
                return moveFocusLeft(state);
            case keyCodes.ENTER:
                state.hiddenFocusElement.focus();
                return moveFocusUp(state);
        }
    }
    else if (isSelectionKey(event)) {
        switch (event.keyCode) {
            case keyCodes.HOME:
                return focusLocation(state, state.cellMatrix.first);
            case keyCodes.END:
                return focusLocation(state, state.cellMatrix.last);
        }
    }
    else {
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
                event.preventDefault();
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
                return __assign(__assign({}, moveFocusDown(state)), { currentlyEditedCell: undefined });
            case keyCodes.ESCAPE:
                event.preventDefault();
                state.hiddenFocusElement.focus();
                return (state.currentlyEditedCell) ? __assign(__assign({}, state), { currentlyEditedCell: undefined }) : state;
        }
    }
    return state;
}
function moveFocusPageUp(state) {
    if (!state.focusedLocation)
        return state;
    var rowsOnScreen = state.cellMatrix.rows.filter(function (row) { return row.top < state.reactGridElement.clientHeight; });
    return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx - rowsOnScreen.length > 0
        ? state.focusedLocation.row.idx - rowsOnScreen.length
        : 0, state);
}
function moveFocusPageDown(state) {
    if (!state.focusedLocation)
        return state;
    var rowsOnScreen = state.cellMatrix.rows
        .slice(state.cellMatrix.stickyTopRange.rows.length, state.cellMatrix.rows.length)
        .filter(function (row) { return row.top + row.height < state.reactGridElement.clientHeight; });
    return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
        ? state.focusedLocation.row.idx + rowsOnScreen.length
        : state.cellMatrix.rows.length - 1, state);
}
function wipeSelectedRanges(state) {
    var location = state.focusedLocation;
    return location ? tryAppendChange(state, { row: location.row, column: location.column }, emptyCell) : state;
}
export function focusCell(colIdx, rowIdx, state) {
    var location = state.cellMatrix.getLocation(rowIdx, colIdx);
    return focusLocation(state, location);
}
export function moveFocusLeft(state) {
    return (state.focusedLocation && state.focusedLocation.column.idx > 0) ?
        focusCell(state.focusedLocation.column.idx - 1, state.focusedLocation.row.idx, state) : state;
}
export function moveFocusRight(state) {
    return (state.focusedLocation && state.focusedLocation.column.idx < state.cellMatrix.last.column.idx) ?
        focusCell(state.focusedLocation.column.idx + 1, state.focusedLocation.row.idx, state) : state;
}
export function moveFocusUp(state) {
    return (state.focusedLocation && state.focusedLocation.row.idx > 0) ?
        focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx - 1, state) : state;
}
export function moveFocusDown(state) {
    if (state.focusedLocation) {
        if (state.focusedLocation.row.idx === state.cellMatrix.last.row.idx)
            return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx, state);
        return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx + 1, state);
    }
    return state;
}
