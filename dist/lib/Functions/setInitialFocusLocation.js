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
export function setInitialFocusLocation(state, locationToFocus) {
    if (locationToFocus && !state.focusedLocation) {
        state = __assign(__assign({}, state), { focusedLocation: state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId) });
    }
    return state;
}
