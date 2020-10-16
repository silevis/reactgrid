import { Cell, CellTemplate, Compatible } from '../Model/PublicModel';
import { State } from '../Model/State';
import { Location } from '../Model/InternalModel';

export function getCompatibleCellAndTemplate(state: State, location: Location): { cell: Compatible<Cell>, cellTemplate: CellTemplate } {
    try {
        const rawCell = state.cellMatrix.getCell(location);
        if (!rawCell) throw new TypeError(`Cell doesn't exists at location`);
        if (!rawCell.type) throw new Error('Cell is missing type property');
        const cellTemplate = state.cellTemplates![rawCell.type];
        if (!cellTemplate) throw new Error(`CellTemplate missing for type '${rawCell.type}'`);
        const cell = cellTemplate.getCompatibleCell({ ...rawCell, type: rawCell.type });
        if (!cell) throw new Error('Cell validation failed');
        return { cell, cellTemplate };
    } catch (e) {
        throw new Error(`${(e as Error).message} (rowId: '${location.row.rowId}', columnId: '${location.column.columnId}')`);
    }
}