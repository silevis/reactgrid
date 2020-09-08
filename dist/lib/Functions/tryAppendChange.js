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
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
export function tryAppendChange(state, location, cell) {
    var _a = getCompatibleCellAndTemplate(state, location), previousCell = _a.cell, cellTemplate = _a.cellTemplate;
    if (previousCell === cell || JSON.stringify(previousCell) === JSON.stringify(cell) || cellTemplate.update === undefined)
        return state;
    var newCell = cellTemplate.update(previousCell, cell);
    if (newCell !== previousCell || JSON.stringify(newCell) !== JSON.stringify(previousCell))
        state.queuedCellChanges.push({
            previousCell: previousCell,
            newCell: newCell,
            type: newCell.type,
            rowId: location.row.rowId,
            columnId: location.column.columnId
        });
    return __assign({}, state);
}
