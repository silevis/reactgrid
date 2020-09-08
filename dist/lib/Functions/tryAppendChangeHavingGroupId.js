import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { tryAppendChange } from './tryAppendChange';
export function tryAppendChangeHavingGroupId(state, location, cell) {
    var cellInLocation = getCompatibleCellAndTemplate(state, location).cell;
    if (cellInLocation.groupId === cell.groupId) {
        return tryAppendChange(state, location, cell);
    }
    else {
        console.warn("New cells data can't be appended into location: ('" + location.column.columnId + "', '" + location.row.rowId + "'). Cell's 'groupId' field doesn't match!");
    }
    return state;
}
