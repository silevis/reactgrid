import { Cell, CellTemplate, Compatible } from '../Model/PublicModel';
import { State } from '../Model/State';
import { Location } from '../Model/InternalModel';
export declare function getCompatibleCellAndTemplate(state: State, location: Location): {
    cell: Compatible<Cell>;
    cellTemplate: CellTemplate;
};
