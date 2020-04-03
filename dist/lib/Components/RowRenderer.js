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
import { CellRenderer } from './CellRenderer';
var RowRenderer = (function (_super) {
    __extends(RowRenderer, _super);
    function RowRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RowRenderer.prototype.shouldComponentUpdate = function (nextProps) {
        return nextProps.forceUpdate || nextProps.columns[0].idx !== this.props.columns[0].idx || nextProps.columns.length !== this.props.columns.length;
    };
    RowRenderer.prototype.render = function () {
        var _this = this;
        var lastColIdx = this.props.columns[this.props.columns.length - 1].idx;
        return this.props.columns.map(function (column) { return React.createElement(CellRenderer, { key: _this.props.row.idx + '-' + column.idx, borders: __assign(__assign({}, _this.props.borders), { left: _this.props.borders.left && column.left === 0, right: _this.props.borders.right && column.idx === lastColIdx }), state: _this.props.state, location: { row: _this.props.row, column: column } }); });
    };
    return RowRenderer;
}(React.Component));
export { RowRenderer };
