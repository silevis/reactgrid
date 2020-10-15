import { Cell, CellChange, Compatible } from '../Model/PublicModel';
import { Location } from '../Model/InternalModel';
import { State } from '../Model/State';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';

export function tryAppendChange(state: State, location: Location, cell: Compatible<Cell>): State {

    const { cell: previousCell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    if (previousCell === cell || JSON.stringify(previousCell) === JSON.stringify(cell) || cellTemplate.update === undefined)
        return state;

    const newCell = cellTemplate.update(previousCell, cell);
    if (newCell !== previousCell || JSON.stringify(newCell) !== JSON.stringify(previousCell))
        state.queuedCellChanges.push({
            previousCell,
            newCell,
            type: newCell.type,
            rowId: location.row.rowId,
            columnId: location.column.columnId
        } as CellChange);
    return { ...state };
}