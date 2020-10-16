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
import { tryAppendChange } from './tryAppendChange';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { areLocationsEqual } from './areLocationsEqual';
export function focusLocation(state, location) {
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }
    var _a = state.props, onFocusLocationChanged = _a.onFocusLocationChanged, onFocusLocationChanging = _a.onFocusLocationChanging, focusLocation = _a.focusLocation;
    if (focusLocation) {
        location = state.cellMatrix.getLocationById(focusLocation.rowId, focusLocation.columnId);
    }
    var _b = getCompatibleCellAndTemplate(state, location), cell = _b.cell, cellTemplate = _b.cellTemplate;
    var cellLocation = { rowId: location.row.rowId, columnId: location.column.columnId };
    var wasChangePrevented = !onFocusLocationChanging || onFocusLocationChanging(cellLocation);
    var isFocusable = (!cellTemplate.isFocusable || cellTemplate.isFocusable(cell)) && wasChangePrevented;
    var validatedFocusLocation = state.cellMatrix.validateLocation(location);
    if (!isFocusable) {
        return state;
    }
    onFocusLocationChanged && (!focusLocation && areLocationsEqual(location, validatedFocusLocation))
        && onFocusLocationChanged(cellLocation);
    return __assign(__assign({}, state), { focusedLocation: validatedFocusLocation, currentlyEditedCell: undefined // TODO disable in derived state from props
     });
}
