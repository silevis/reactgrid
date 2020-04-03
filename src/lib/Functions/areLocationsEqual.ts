import { Location } from '../Model';

export function areLocationsEqual(location1: Location, location2?: Location) {
    return location1.column.idx === location2?.column.idx && location1.row.idx === location2?.row.idx;
}