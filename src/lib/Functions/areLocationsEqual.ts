import { Location } from '../Model/InternalModel';

export function areLocationsEqual(location1: Location, location2?: Location) {
    return location1.column.columnId === location2?.column.columnId
        && location1.row.rowId === location2?.row.rowId;
}