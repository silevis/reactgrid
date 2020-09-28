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
import * as React from 'react';
function shouldMemoRowRenderer(prevProps, nextProps) {
    var prevCols = prevProps.columns;
    var nextCols = nextProps.columns, forceUpdate = nextProps.forceUpdate;
    return !(forceUpdate
        || nextCols[0].idx !== prevCols[0].idx || nextCols.length !== prevCols.length
        || nextCols[nextCols.length - 1].idx !== prevCols[prevCols.length - 1].idx);
}
export var RowRenderer = React.memo(function (_a) {
    var columns = _a.columns, row = _a.row, cellRenderer = _a.cellRenderer, borders = _a.borders, state = _a.state;
    var lastColIdx = columns[columns.length - 1].idx;
    var CellRenderer = cellRenderer;
    return (React.createElement(React.Fragment, null, columns.map(function (column) {
        var location = { row: row, column: column };
        return React.createElement(CellRenderer, { key: row.idx + '-' + column.idx, borders: __assign(__assign({}, borders), { left: borders.left && column.left === 0, right: (borders.right && column.idx === lastColIdx) || !(state.cellMatrix.scrollableRange.last.column.idx === location.column.idx) }), state: state, location: location });
    })));
}, shouldMemoRowRenderer);
