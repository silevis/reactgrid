import { Location, State, Cell, Compatible, DefaultCellTypes, Type } from '../Model';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';

export function tryAppendChange(state: State, location: Location, cell: Compatible<Cell>): State {

    const { cell: initialCell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    if (initialCell === cell || JSON.stringify(initialCell) === JSON.stringify(cell) || cellTemplate.update === undefined)
        return state;

    const newCell = cellTemplate.update(initialCell, cell);
    if (newCell !== initialCell || JSON.stringify(newCell) !== JSON.stringify(initialCell))
        state.queuedCellChanges.push({
            initialCell: initialCell as DefaultCellTypes,
            newCell: newCell as DefaultCellTypes,
            type: newCell.type as Type<DefaultCellTypes>,
            rowId: location.row.rowId,
            columnId: location.column.columnId
        });
    return { ...state };
}