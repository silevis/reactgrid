import { GridColumn, GridRow, Location } from './InternalModel';
import { Cell, Column, Id, Row } from './PublicModel';
import { Range } from './Range';


export interface IndexLookup {
    [id: string]: number;
}

// INTERNAL
export interface CellMatrixProps {
    columns: Column[];
    rows: Row<Cell>[];
    stickyTopRows?: number;
    stickyLeftColumns?: number;
}

export interface StickyRanges {
    stickyTopRange: Range;
    stickyLeftRange: Range;
}

// INTERNAL
export class CellMatrix<TStickyRanges extends StickyRanges = StickyRanges, TCellMatrixProps extends CellMatrixProps = CellMatrixProps> {

    static DEFAULT_ROW_HEIGHT = 25;
    static DEFAULT_COLUMN_WIDTH = 150;

    props!: TCellMatrixProps;
    scrollableRange!: Range;
    width: number = 0;
    height: number = 0;

    columns!: GridColumn[];
    rows!: GridRow[];
    first!: Location;
    last!: Location;

    rowIndexLookup: IndexLookup = {};
    columnIndexLookup: IndexLookup = {};

    constructor(public ranges: TStickyRanges) { }

    getRange(start: Location, end: Location): Range {
        const cols = this.columns.slice(start.column.idx < end.column.idx ? start.column.idx : end.column.idx, start.column.idx > end.column.idx ? start.column.idx + 1 : end.column.idx + 1);
        const rows = this.rows.slice(start.row.idx < end.row.idx ? start.row.idx : end.row.idx, start.row.idx > end.row.idx ? start.row.idx + 1 : end.row.idx + 1);
        return new Range(rows, cols);
    }

    getLocation(rowIdx: number, columnIdx: number): Location {
        return { row: this.rows[rowIdx], column: this.columns[columnIdx] };
    }

    getLocationById(rowId: Id, columnId: Id): Location {
        try {
            const row = this.rows[this.rowIndexLookup[rowId]];
            const column = this.columns[this.columnIndexLookup[columnId]];
            return this.validateLocation({ row, column });
        } catch (error) {
            throw new EvalError(`column: '${columnId}', row: '${rowId}'`)
        }
    }

    validateLocation(location: Location): Location {
        const colIdx = this.columnIndexLookup[location.column.columnId] !== undefined ? this.columnIndexLookup[location.column.columnId] : location.column.idx < this.last.column.idx ? location.column.idx : this.last.column.idx;
        const rowIdx = this.rowIndexLookup[location.row.rowId] !== undefined ? this.rowIndexLookup[location.row.rowId] : location.row.idx < this.last.row.idx ? location.row.idx : this.last.row.idx;
        return this.getLocation(rowIdx, colIdx);
    }

    validateRange(range: Range): Range {
        return this.getRange(this.validateLocation(range.first), this.validateLocation(range.last));
    }

    getCell(location: Location): Cell {
        return this.rows[location.row.idx].cells[location.column.idx];
    }

}
