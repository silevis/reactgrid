import { Range } from './Range';
// INTERNAL
var CellMatrix = /** @class */ (function () {
    function CellMatrix(ranges) {
        this.ranges = ranges;
        this.width = 0;
        this.height = 0;
        this.rowIndexLookup = {};
        this.columnIndexLookup = {};
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
        try {
            var row = this.rows[this.rowIndexLookup[rowId]];
            var column = this.columns[this.columnIndexLookup[columnId]];
            return this.validateLocation({ row: row, column: column });
        }
        catch (error) {
            throw new EvalError("column: '" + columnId + "', row: '" + rowId + "'");
        }
    };
    CellMatrix.prototype.validateLocation = function (location) {
        var colIdx = this.columnIndexLookup[location.column.columnId] !== undefined ? this.columnIndexLookup[location.column.columnId] : location.column.idx < this.last.column.idx ? location.column.idx : this.last.column.idx;
        var rowIdx = this.rowIndexLookup[location.row.rowId] !== undefined ? this.rowIndexLookup[location.row.rowId] : location.row.idx < this.last.row.idx ? location.row.idx : this.last.row.idx;
        return this.getLocation(rowIdx, colIdx);
    };
    CellMatrix.prototype.validateRange = function (range) {
        return this.getRange(this.validateLocation(range.first), this.validateLocation(range.last));
    };
    CellMatrix.prototype.getCell = function (location) {
        return this.rows[location.row.idx].cells[location.column.idx];
    };
    CellMatrix.DEFAULT_ROW_HEIGHT = 25;
    CellMatrix.DEFAULT_COLUMN_WIDTH = 150;
    return CellMatrix;
}());
export { CellMatrix };
