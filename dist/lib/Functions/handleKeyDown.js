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
import { focusLocation, keyCodes } from '.';
import { isSelectionKey } from './isSelectionKey';
import { focusCell, moveFocusUp, moveFocusDown, moveFocusLeft, moveFocusRight, moveFocusPageDown, moveFocusPageUp } from '../Functions/focuses';
import { wipeSelectedRanges } from './wipeSelectedRanges';
import { handleKeyDownOnCellTemplate } from './handleKeyDownOnCellTemplate';
export function handleKeyDown(state, event) {
    var newState = handleKeyDownInternal(state, event);
    if (newState !== state) {
        event.stopPropagation();
        event.preventDefault();
    }
    return newState;
}
function handleKeyDownInternal(state, event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var location = state.focusedLocation;
    if (!location) {
        return state;
    }
    var newState = handleKeyDownOnCellTemplate(state, event);
    if (newState !== state) {
        return newState;
    }
    if (event.altKey)
        return state;
    if (event.shiftKey) {
        switch (event.keyCode) {
            case keyCodes.TAB:
                event.preventDefault();
                return moveFocusLeft(state);
            case keyCodes.ENTER:
                (_a = state.hiddenFocusElement) === null || _a === void 0 ? void 0 : _a.focus();
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
                (_b = state.hiddenFocusElement) === null || _b === void 0 ? void 0 : _b.focus();
                return wipeSelectedRanges(state);
            case keyCodes.UP_ARROW:
                (_c = state.hiddenFocusElement) === null || _c === void 0 ? void 0 : _c.focus();
                return moveFocusUp(state);
            case keyCodes.DOWN_ARROW:
                (_d = state.hiddenFocusElement) === null || _d === void 0 ? void 0 : _d.focus();
                return moveFocusDown(state);
            case keyCodes.LEFT_ARROW:
                (_e = state.hiddenFocusElement) === null || _e === void 0 ? void 0 : _e.focus();
                return moveFocusLeft(state);
            case keyCodes.RIGHT_ARROW:
                (_f = state.hiddenFocusElement) === null || _f === void 0 ? void 0 : _f.focus();
                return moveFocusRight(state);
            case keyCodes.TAB:
                (_g = state.hiddenFocusElement) === null || _g === void 0 ? void 0 : _g.focus();
                event.preventDefault();
                return moveFocusRight(state);
            case keyCodes.HOME:
                (_h = state.hiddenFocusElement) === null || _h === void 0 ? void 0 : _h.focus();
                return state.focusedLocation ? focusCell(0, state.focusedLocation.row.idx, state) : state;
            case keyCodes.END:
                (_j = state.hiddenFocusElement) === null || _j === void 0 ? void 0 : _j.focus();
                return state.focusedLocation
                    ? focusCell(state.cellMatrix.columns.length - 1, state.focusedLocation.row.idx, state)
                    : state;
            case keyCodes.PAGE_UP:
                (_k = state.hiddenFocusElement) === null || _k === void 0 ? void 0 : _k.focus();
                return moveFocusPageUp(state);
            case keyCodes.PAGE_DOWN:
                (_l = state.hiddenFocusElement) === null || _l === void 0 ? void 0 : _l.focus();
                return moveFocusPageDown(state);
            case keyCodes.ENTER:
                (_m = state.hiddenFocusElement) === null || _m === void 0 ? void 0 : _m.focus();
                return __assign(__assign({}, moveFocusDown(state)), { currentlyEditedCell: undefined });
            case keyCodes.ESCAPE:
                event.preventDefault();
                (_o = state.hiddenFocusElement) === null || _o === void 0 ? void 0 : _o.focus();
                return (state.currentlyEditedCell) ? __assign(__assign({}, state), { currentlyEditedCell: undefined }) : state;
        }
    }
    return state;
}
