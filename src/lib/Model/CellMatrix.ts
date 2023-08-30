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
    stickyRightColumns?: number;
    stickyBottomRows?: number;
    minColumnWidth?: number;
}

export interface StickyRanges {
    stickyTopRange: Range;
    stickyLeftRange: Range;
    stickyRightRange: Range;
    stickyBottomRange: Range;
}

export interface SpanLookup {
    range?: Range;
}

// INTERNAL
export class CellMatrix {

    static DEFAULT_ROW_HEIGHT = 25;
    static DEFAULT_COLUMN_WIDTH = 150;
    static MIN_COLUMN_WIDTH = 40;

    props!: CellMatrixProps;
    scrollableRange!: Range;
    width = 0;
    height = 0;

    columns!: GridColumn[];
    rows!: GridRow[];
    first!: Location;
    last!: Location;

    rowIndexLookup: IndexLookup = {};
    columnIndexLookup: IndexLookup = {};

    spanCellLookup: { [location: string]: SpanLookup } = {};

    rangesToRender: { [location: string]: SpanLookup } = {};

    constructor(public ranges: StickyRanges) { }

    getRange(start: Location, end: Location): Range {
        const cols = this.columns.slice(
            Math.min(start.column.idx, end.column.idx), 
            Math.max(start.column.idx, end.column.idx) + 1
        );
        const rows = this.rows.slice(
            Math.min(start.row.idx, end.row.idx),
            Math.max(start.row.idx, end.row.idx) + 1
        );

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
            throw new RangeError(`column: '${columnId}', row: '${rowId}'`)
        }
    }

    validateLocation(location: Location): Location {
        const colIdx = this.columnIndexLookup[location.column.columnId] ?? Math.min(location.column.idx, this.last.column.idx);
        const rowIdx = this.rowIndexLookup[location.row.rowId] ?? Math.min(location.row.idx, this.last.row.idx);
        return this.getLocation(rowIdx, colIdx);
    }

    validateRange(range: Range): Range {
        return this.getRange(this.validateLocation(range.first), this.validateLocation(range.last));
    }

    getCell(location: Location): Cell {
        return this.rows[location.row.idx].cells[location.column.idx];
    }

}

export function translateLocationIdxToLookupKey(idx: number, idy: number): string {
    return `${idx}, ${idy}`;
}
