import { Id } from './PublicModel';
import { Range } from './Range';
import { Column, Row, Location, Cell, GridRow, GridColumn } from '.';

export interface IndexLookup {
    [id: string]: number;
}

// INTERNAL
export interface AbstractCellMatrixProps {
    columns: Column[];
    rows: Row[];
    stickyTopRows?: number;
    stickyLeftColumns?: number;
}

// INTERNAL
export abstract class AbstractCellMatrix {
    readonly abstract stickyTopRange: Range;
    readonly abstract stickyLeftRange: Range;
    readonly abstract scrollableRange: Range;
    readonly abstract width: number = 0;
    readonly abstract height: number = 0;

    readonly abstract columns: GridColumn[];
    readonly abstract rows: GridRow[];
    readonly abstract first: Location;
    readonly abstract last: Location;

    protected readonly rowIndexLookup: IndexLookup = {};
    protected readonly columnIndexLookup: IndexLookup = {};

    static DEFAULT_ROW_HEIGHT = 25;
    static DEFAULT_COLUMN_WIDTH = 150;

    constructor(public readonly props: AbstractCellMatrixProps) { }

    getRange(start: Location, end: Location): Range {
        const cols = this.columns.slice(start.column.idx < end.column.idx ? start.column.idx : end.column.idx, start.column.idx > end.column.idx ? start.column.idx + 1 : end.column.idx + 1);
        const rows = this.rows.slice(start.row.idx < end.row.idx ? start.row.idx : end.row.idx, start.row.idx > end.row.idx ? start.row.idx + 1 : end.row.idx + 1);
        return new Range(rows, cols);
    }

    getLocation(rowIdx: number, columnIdx: number): Location {
        return { row: this.rows[rowIdx], column: this.columns[columnIdx] };
    }

    getLocationById(rowId: Id, columnId: Id): Location {
        const row = this.rows[this.rowIndexLookup[rowId]];
        const column = this.columns[this.columnIndexLookup[columnId]];
        return this.validateLocation({ row, column });
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
        return this.rows[location.row.idx].cells[location.column.idx]
    }
}
