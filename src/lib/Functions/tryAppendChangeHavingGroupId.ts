import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { State, Compatible, Cell, Location } from '../Model';
import { tryAppendChange } from './tryAppendChange';

export function tryAppendChangeHavingGroupId(state: State, location: Location, cell: Compatible<Cell>): State {
    const { cell: cellInLocation } = getCompatibleCellAndTemplate(state, location);
    if (cellInLocation.groupId === cell.groupId) {
        return tryAppendChange(state, location, cell);
    } else {
        console.warn(`New cells data can't be appended into location: (${location.column.columnId}, ${location.row.rowId}). Cell's 'groupId' field doesn't match!`);
    }
    return state;
}