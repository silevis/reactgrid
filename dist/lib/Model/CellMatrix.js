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
import { Range } from './Range';
var DEFAULT_ROW_HEIGHT = 25;
var DEFAULT_COLUMN_WIDTH = 150;
var CellMatrix = (function () {
    function CellMatrix(props) {
        var _this = this;
        this.props = props;
        this.width = 0;
        this.height = 0;
        this.rowIndexLookup = {};
        this.columnIndexLookup = {};
        var totalHeight = 0, totalWidth = 0;
        this.rows = props.rows.reduce(function (rows, row, idx) {
            var top = idx === 0 || idx === props.stickyTopRows ? 0 : rows[idx - 1].top + rows[idx - 1].height;
            var height = row.height || DEFAULT_ROW_HEIGHT;
            rows.push(__assign(__assign({}, row), { top: top, height: height, idx: idx, bottom: top + height }));
            totalHeight += height;
            _this.rowIndexLookup[row.rowId] = idx;
            return rows;
        }, []);
        this.columns = props.columns.reduce(function (cols, column, idx) {
            var left = idx === 0 || idx === props.stickyLeftColumns ? 0 : cols[idx - 1].left + cols[idx - 1].width;
            var width = column.width || DEFAULT_COLUMN_WIDTH;
            cols.push(__assign(__assign({}, column), { idx: idx, left: left, width: width, right: left + width }));
            totalWidth += width;
            _this.columnIndexLookup[column.columnId] = idx;
            return cols;
        }, []);
        this.height = totalHeight;
        this.width = totalWidth;
        this.stickyLeftRange = new Range(this.rows, this.columns.slice(0, props.stickyLeftColumns || 0));
        this.stickyTopRange = new Range(this.rows.slice(0, props.stickyTopRows || 0), this.columns);
        this.scrollableRange = new Range(this.rows.slice(props.stickyTopRows || 0), this.columns.slice(props.stickyLeftColumns || 0));
        this.first = this.getLocation(0, 0);
        this.last = this.getLocation(this.rows.length - 1, this.columns.length - 1);
    }
    CellMatrix.prototype.getRange = function (start, end) {
        var cols = this.columns.slice(start.column.idx < end.column.idx ? start.column.idx : end.column.idx, start.column.idx > end.column.idx ? start.column.idx + 1 : end.column.idx + 1);
        var rows = this.rows.slice(start.row.idx < end.row.idx ? start.row.idx : end.row.idx, start.row.idx > end.row.idx ? start.row.idx + 1 : end.row.idx + 1);
        return new Range(rows, cols);
    };
    CellMatrix.prototype.getLocation = function (rowIdx, columnIdx) {
        return { row: this.rows[rowIdx], column: this.columns[columnIdx] };
    };
    CellMatrix.prototype.getLocationById = function (rowId, columnId) {
        var row = this.rows[this.rowIndexLookup[rowId]];
        var column = this.columns[this.columnIndexLookup[columnId]];
        return this.validateLocation({ row: row, column: column });
    };
    CellMatrix.prototype.validateLocation = function (location) {
        var colIdx = this.columnIndexLookup[location.column.columnId] !== undefined ? this.columnIndexLookup[location.column.columnId] : location.column.idx < this.last.column.idx ? location.column.idx : this.last.column.idx;
        var rowIdx = this.rowIndexLookup[location.row.rowId] !== undefined ? this.rowIndexLookup[location.row.rowId] : location.row.idx < this.last.row.idx ? location.row.idx : this.last.row.idx;
        return this.getLocation(rowIdx, colIdx);
    };
    CellMatrix.prototype.getCell = function (location) {
        return this.rows[location.row.idx].cells[location.column.idx];
    };
    return CellMatrix;
}());
export { CellMatrix };
