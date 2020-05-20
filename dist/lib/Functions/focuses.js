import { focusLocation } from "./focusLocation";
import { getVisibleScrollAreaHeight, isFocusLocationOnTopSticky } from ".";
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
function getVisibleHeight(state) {
    var stickyTopRange = state.cellMatrix.ranges.stickyTopRange;
    var wholeStickyHeight = stickyTopRange.height;
    var visibleScrollAreaHeight = getVisibleScrollAreaHeight(state, wholeStickyHeight);
    return visibleScrollAreaHeight;
}
export function withMoveFocusPageUp(fc) {
    return function (state) {
        var visibleScrollAreaHeight = getVisibleHeight(state);
        var location = state.focusedLocation;
        if (!state.focusedLocation)
            return state;
        var hasTopSticky = state.cellMatrix.ranges.stickyTopRange.rows.length > 0;
        var isOnTopSticky = hasTopSticky && isFocusLocationOnTopSticky(state, location);
        var hasScrollableRange = state.cellMatrix.scrollableRange.rows.length > 0;
        var isOnFirstElementOnScrollableRange = hasScrollableRange && (location === null || location === void 0 ? void 0 : location.row.idx) === state.cellMatrix.scrollableRange.first.row.idx;
        var rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(function (row) { return row.bottom < visibleScrollAreaHeight; });
        var stickyTopRange = state.cellMatrix.ranges.stickyTopRange;
        var rowIdx = 0;
        if (isOnTopSticky) {
            rowIdx = state.cellMatrix.ranges.stickyTopRange.first.row.idx;
        }
        else if (isOnFirstElementOnScrollableRange) {
            rowIdx = stickyTopRange.rows.length > 0 ? state.cellMatrix.ranges.stickyTopRange.last.row.idx : state.cellMatrix.first.row.idx;
        }
        else if (location.row.idx >= rowsOnScreen.length + state.cellMatrix.ranges.stickyTopRange.rows.length) {
            rowIdx = state.focusedLocation.row.idx - rowsOnScreen.length > 0
                ? state.focusedLocation.row.idx - rowsOnScreen.length
                : 0;
        }
        else {
            rowIdx = state.cellMatrix.scrollableRange.first.row.idx;
        }
        return fc(state.focusedLocation.column.idx, rowIdx, state);
    };
}
export function withMoveFocusPageDown(fc) {
    return function (state) {
        var _a;
        var visibleScrollAreaHeight = getVisibleHeight(state);
        var location = state.focusedLocation;
        if (!state.focusedLocation)
            return state;
        var isOnTopSticky = isFocusLocationOnTopSticky(state, location);
        var hasTopSticky = state.cellMatrix.ranges.stickyTopRange.rows.length > 0;
        var isOnLastRowOnTopSticky = hasTopSticky && (location === null || location === void 0 ? void 0 : location.row.idx) === ((_a = state.cellMatrix.ranges) === null || _a === void 0 ? void 0 : _a.stickyTopRange.last.row.idx);
        var hasScrollableRange = state.cellMatrix.scrollableRange.rows.length > 0;
        var rowIdx = 0;
        if (isOnTopSticky) {
            if (isOnTopSticky && !isOnLastRowOnTopSticky) {
                rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx;
            }
            else {
                hasScrollableRange ? rowIdx = state.cellMatrix.scrollableRange.first.row.idx : rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx;
            }
        }
        else {
            var rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(function (row) { return row.top + row.height < visibleScrollAreaHeight; });
            rowIdx = state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
                ? state.focusedLocation.row.idx + rowsOnScreen.length
                : state.cellMatrix.rows.length - 1;
        }
        return fc(state.focusedLocation.column.idx, rowIdx, state);
    };
}
