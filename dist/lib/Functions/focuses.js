import { focusLocation } from "./focusLocation";
export var focusCell = withFocusLocation(focusLocation);
export var moveFocusLeft = withMoveFocusLeft(focusCell);
export var moveFocusRight = withMoveFocusRight(focusCell);
export var moveFocusUp = withMoveFocusUp(focusCell);
export var moveFocusDown = withMoveFocusDown(focusCell);
export var moveFocusPageUp = withMoveFocusPageUp(focusCell);
export var moveFocusPageDown = withMoveFocusPageDown(focusCell);
export function withFocusLocation(focusLocation) {
    return function (colIdx, rowIdx, state) {
        return focusLocation(state, state.cellMatrix.getLocation(rowIdx, colIdx));
    };
}
export function withMoveFocusLeft(fc) {
    return function (state) { return (state.focusedLocation && state.focusedLocation.column.idx > 0) ?
        fc(state.focusedLocation.column.idx - 1, state.focusedLocation.row.idx, state) : state; };
}
export function withMoveFocusRight(fc) {
    return function (state) {
        return (state.focusedLocation && state.focusedLocation.column.idx < state.cellMatrix.last.column.idx) ?
            fc(state.focusedLocation.column.idx + 1, state.focusedLocation.row.idx, state) : state;
    };
}
export function withMoveFocusUp(fc) {
    return function (state) {
        return (state.focusedLocation && state.focusedLocation.row.idx > 0) ?
            fc(state.focusedLocation.column.idx, state.focusedLocation.row.idx - 1, state) : state;
    };
}
export function withMoveFocusDown(fc) {
    return function (state) {
        if (state.focusedLocation) {
            if (state.focusedLocation.row.idx === state.cellMatrix.last.row.idx)
                return fc(state.focusedLocation.column.idx, state.focusedLocation.row.idx, state);
            return fc(state.focusedLocation.column.idx, state.focusedLocation.row.idx + 1, state);
        }
        return state;
    };
}
export function withMoveFocusPageUp(fc) {
    return function (state) {
        if (!state.focusedLocation)
            return state;
        var rowsOnScreen = state.cellMatrix.rows.filter(function (row) { return row.top < state.reactGridElement.clientHeight; });
        return fc(state.focusedLocation.column.idx, state.focusedLocation.row.idx - rowsOnScreen.length > 0
            ? state.focusedLocation.row.idx - rowsOnScreen.length
            : 0, state);
    };
}
export function withMoveFocusPageDown(fc) {
    return function (state) {
        if (!state.focusedLocation)
            return state;
        var rowsOnScreen = state.cellMatrix.rows
            .slice(state.cellMatrix.ranges.stickyTopRange.rows.length, state.cellMatrix.rows.length)
            .filter(function (row) { return row.top + row.height < state.reactGridElement.clientHeight; });
        return fc(state.focusedLocation.column.idx, state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
            ? state.focusedLocation.row.idx + rowsOnScreen.length
            : state.cellMatrix.rows.length - 1, state);
    };
}
