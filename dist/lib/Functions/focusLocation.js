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
    var _a = getCompatibleCellAndTemplate(state, location), cell = _a.cell, cellTemplate = _a.cellTemplate;
    var isFocusable = !cellTemplate.isFocusable || cellTemplate.isFocusable(cell);
    if (!isFocusable)
        return state;
    var onFocusLocationChanged = state.props.onFocusLocationChanged;
    onFocusLocationChanged && onFocusLocationChanged({ rowId: location.row.rowId, columnId: location.column.columnId });
    return __assign(__assign({}, state), { focusedLocation: state.cellMatrix.validateLocation(location), currentlyEditedCell: undefined });
}
