var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export function getCompatibleCellAndTemplate(state, location) {
    try {
        var rawCell = state.cellMatrix.getCell(location);
        if (!rawCell)
            throw new TypeError("Cell doesn't exists at location");
        if (!rawCell.type)
            throw new Error('Cell is missing type property');
        var cellTemplate = state.cellTemplates[rawCell.type];
        if (!cellTemplate)
            throw new Error("CellTemplate missing for type '" + rawCell.type + "'");
        var cell = cellTemplate.getCompatibleCell(__assign(__assign({}, rawCell), { type: rawCell.type }));
        if (!cell)
            throw new Error('Cell validation failed');
        return { cell: cell, cellTemplate: cellTemplate };
    }
    catch (e) {
        throw new Error(e.message + " (rowId: '" + location.row.rowId + "', columnId: '" + location.column.columnId + "')");
    }
}
