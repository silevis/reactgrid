import { State, Location, Compatible, Cell, CellTemplate } from '../Model';
export declare function getCompatibleCellAndTemplate(state: State, location: Location): {
    cell: Compatible<Cell>;
    cellTemplate: CellTemplate;
};
