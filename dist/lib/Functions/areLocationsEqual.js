export function areLocationsEqual(location1, location2) {
    return location1.column.idx === (location2 === null || location2 === void 0 ? void 0 : location2.column.idx) && location1.row.idx === (location2 === null || location2 === void 0 ? void 0 : location2.row.idx);
}
