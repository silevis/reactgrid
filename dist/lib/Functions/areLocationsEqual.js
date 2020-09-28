export function areLocationsEqual(location1, location2) {
    return location1.column.columnId === (location2 === null || location2 === void 0 ? void 0 : location2.column.columnId)
        && location1.row.rowId === (location2 === null || location2 === void 0 ? void 0 : location2.row.rowId);
}
