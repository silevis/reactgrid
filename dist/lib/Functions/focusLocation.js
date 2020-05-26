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
export function focusLocation(state, location) {
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }
    var _a = state.props, onFocusLocationChanged = _a.onFocusLocationChanged, onFocusLocationChanging = _a.onFocusLocationChanging;
    var _b = getCompatibleCellAndTemplate(state, location), cell = _b.cell, cellTemplate = _b.cellTemplate;
    var cellLocation = { rowId: location.row.rowId, columnId: location.column.columnId };
    var isFocusable = (!cellTemplate.isFocusable || cellTemplate.isFocusable(cell)) &&
        (!onFocusLocationChanging || onFocusLocationChanging(cellLocation));
    if (!isFocusable)
        return state;
    onFocusLocationChanged && onFocusLocationChanged(cellLocation);
    return __assign(__assign({}, state), { focusedLocation: state.cellMatrix.validateLocation(location), currentlyEditedCell: undefined });
}
