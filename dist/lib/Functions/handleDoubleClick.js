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
import { areLocationsEqual } from './areLocationsEqual';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { isSelectionKey } from './isSelectionKey';
export function handleDoubleClick(event, location, state) {
    if (areLocationsEqual(location, state.focusedLocation)) {
        var _a = getCompatibleCellAndTemplate(state, location), cell = _a.cell, cellTemplate = _a.cellTemplate;
        if (cellTemplate.handleKeyDown) {
            var _b = cellTemplate.handleKeyDown(cell, 1, isSelectionKey(event), event.shiftKey, event.altKey), newCell = _b.cell, enableEditMode = _b.enableEditMode;
            if (enableEditMode) {
                return __assign(__assign({}, state), { currentlyEditedCell: newCell });
            }
        }
    }
    return state;
}
