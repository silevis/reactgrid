var Range = (function () {
    function Range(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.first = { row: this.rows[0], column: this.columns[0] };
        this.last = { row: this.rows[this.rows.length - 1], column: this.columns[this.columns.length - 1] };
        this.height = this.rows.reduce(function (a, b) { return a + b.height; }, 0);
        this.width = this.columns.reduce(function (a, b) { return a + b.width; }, 0);
    }
    Range.prototype.contains = function (location) {
        return location.column.idx >= this.first.column.idx &&
            location.column.idx <= this.last.column.idx &&
            location.row.idx >= this.first.row.idx &&
            location.row.idx <= this.last.row.idx;
    };
    Range.prototype.slice = function (range, direction) {
        var firstRow = direction === 'rows' && range ? range.first.row : this.first.row;
        var firstColumn = direction === 'columns' && range ? range.first.column : this.first.column;
        var lastRow = direction === 'rows' && range ? range.last.row : this.last.row;
        var lastColumn = direction === 'columns' && range ? range.last.column : this.last.column;
        var slicedRows = this.rows.slice(firstRow.idx - this.first.row.idx, lastRow.idx - this.first.row.idx + 1);
        var slicedColumns = this.columns.slice(firstColumn.idx - this.first.column.idx, lastColumn.idx - this.first.column.idx + 1);
        return new Range(slicedRows, slicedColumns);
    };
    return Range;
}());
export { Range };
