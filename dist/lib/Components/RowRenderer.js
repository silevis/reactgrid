var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var RowRenderer = (function (_super) {
    __extends(RowRenderer, _super);
    function RowRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RowRenderer.prototype.shouldComponentUpdate = function (nextProps) {
        var columns = this.props.columns;
        return nextProps.forceUpdate
            || nextProps.columns[0].idx !== columns[0].idx || nextProps.columns.length !== columns.length
            || nextProps.columns[nextProps.columns.length - 1].idx !== columns[columns.length - 1].idx;
    };
    RowRenderer.prototype.render = function () {
        var _a = this.props, columns = _a.columns, row = _a.row, cellRenderer = _a.cellRenderer, borders = _a.borders, state = _a.state;
        var lastColIdx = columns[columns.length - 1].idx;
        var CellRenderer = cellRenderer;
        return columns.map(function (column) { return React.createElement(CellRenderer, { key: row.idx + '-' + column.idx, borders: __assign(__assign({}, borders), { left: borders.left && column.left === 0, right: borders.right && column.idx === lastColIdx }), state: state, location: { row: row, column: column } }); });
    };
    return RowRenderer;
}(React.Component));
export { RowRenderer };
