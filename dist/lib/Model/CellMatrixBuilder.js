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
import { CellMatrix } from './CellMatrix';
import { Range } from './Range';
var CellMatrixBuilder = /** @class */ (function () {
    function CellMatrixBuilder() {
        var _this = this;
        this.getTop = function (idx, stickyTopRows, rows) {
            return idx === 0 || idx === stickyTopRows ? 0 : rows[idx - 1].top + rows[idx - 1].height;
        };
        this.getLeft = function (idx, stickyLeftColumns, cols) {
            return idx === 0 || idx === stickyLeftColumns ? 0 : cols[idx - 1].left + cols[idx - 1].width;
        };
        this.getScrollableRange = function () {
            var stickyTopRows = _this.cellMatrix.props.stickyTopRows;
            var stickyLeftColumns = _this.cellMatrix.props.stickyLeftColumns;
            var firstScrollableRowId = !stickyTopRows || stickyTopRows >= _this.cellMatrix.rows.length ? 0 : stickyTopRows;
            var firstScrollableColumnId = !stickyLeftColumns || stickyLeftColumns >= _this.cellMatrix.columns.length ? 0 : stickyLeftColumns;
            return new Range(_this.cellMatrix.rows.slice(firstScrollableRowId), _this.cellMatrix.columns.slice(firstScrollableColumnId));
        };
        this.reset();
    }
    CellMatrixBuilder.prototype.reset = function () {
        this.cellMatrix = new CellMatrix({});
        return this;
    };
    CellMatrixBuilder.prototype.setProps = function (props) {
        this.cellMatrix.props = props;
        return this;
    };
    CellMatrixBuilder.prototype.fillRowsAndCols = function () {
        var _this = this;
        if (!Array.isArray(this.cellMatrix.props.rows)) {
            throw new Error('Feeded ReactGrids "rows" property is not an array!');
        }
        if (!Array.isArray(this.cellMatrix.props.columns)) {
            throw new Error('Feeded ReactGrids "columns" property is not an array!');
        }
        this.cellMatrix.rows = this.cellMatrix.props.rows.reduce(function (rows, row, idx) {
            var top = _this.getTop(idx, _this.cellMatrix.props.stickyTopRows, rows);
            var height = row.height || CellMatrix.DEFAULT_ROW_HEIGHT;
            rows.push(__assign(__assign({}, row), { top: top, height: height, idx: idx, bottom: top + height }));
            _this.cellMatrix.height += height;
            // TODO what with rowIndexLookup?
            _this.cellMatrix.rowIndexLookup[row.rowId] = idx;
            return rows;
        }, []);
        this.cellMatrix.columns = this.cellMatrix.props.columns.reduce(function (cols, column, idx) {
            var left = _this.getLeft(idx, _this.cellMatrix.props.stickyLeftColumns, cols);
            var width = column.width
                ? (column.width < CellMatrix.MIN_COLUMN_WIDTH ? CellMatrix.MIN_COLUMN_WIDTH : column.width)
                : CellMatrix.DEFAULT_COLUMN_WIDTH;
            cols.push(__assign(__assign({}, column), { idx: idx, left: left, width: width, right: left + width }));
            _this.cellMatrix.width += width;
            // TODO what with columnIndexLookup?
            _this.cellMatrix.columnIndexLookup[column.columnId] = idx;
            return cols;
        }, []);
        return this;
    };
    CellMatrixBuilder.prototype.fillSticky = function () {
        this.cellMatrix.ranges.stickyLeftRange = new Range(this.cellMatrix.rows, this.cellMatrix.columns.slice(0, this.cellMatrix.props.stickyLeftColumns || 0));
        this.cellMatrix.ranges.stickyTopRange = new Range(this.cellMatrix.rows.slice(0, this.cellMatrix.props.stickyTopRows || 0), this.cellMatrix.columns);
        return this;
    };
    CellMatrixBuilder.prototype.fillScrollableRange = function () {
        this.cellMatrix.scrollableRange = this.getScrollableRange();
        return this;
    };
    CellMatrixBuilder.prototype.setEdgeLocations = function () {
        this.cellMatrix.first = this.cellMatrix.getLocation(0, 0);
        this.cellMatrix.last = this.cellMatrix.getLocation(this.cellMatrix.rows.length - 1, this.cellMatrix.columns.length - 1);
        return this;
    };
    CellMatrixBuilder.prototype.getCellMatrix = function () {
        var result = this.cellMatrix;
        this.reset();
        return result;
    };
    return CellMatrixBuilder;
}());
export { CellMatrixBuilder };
