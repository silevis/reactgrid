import { Id } from './PublicModel';
import { Range } from './Range';
import { Column, Row, Location, Cell, GridRow, GridColumn } from '.';

const DEFAULT_ROW_HEIGHT = 25;
const DEFAULT_COLUMN_WIDTH = 150;

interface IndexLookup {
    [id: string]: number;
}

// INTERNAL
export interface CellMatrixProps {
    columns: Column[];
    rows: Row[];
    stickyTopRows?: number;
    stickyLeftColumns?: number;
}

// INTERNAL
export class CellMatrix {
    readonly stickyTopRange: Range;
    readonly stickyLeftRange: Range;
    readonly scrollableRange: Range;
    readonly width: number = 0;
    readonly height: number = 0;

    readonly columns: GridColumn[];
    readonly rows: GridRow[];
    readonly first: Location;
    readonly last: Location;

    private readonly rowIndexLookup: IndexLookup = {};
    private readonly columnIndexLookup: IndexLookup = {};

    constructor(public readonly props: CellMatrixProps) {
        // add opporutnity to add custom manage cellMatrix and rigth and bottom sticky
        let totalHeight = 0,
            totalWidth = 0;

        this.rows = props.rows.reduce(
            (rows, row, idx) => {
                const top = idx === 0 || idx === props.stickyTopRows ? 0 : rows[idx - 1].top + rows[idx - 1].height;
                const height = row.height || DEFAULT_ROW_HEIGHT;
                rows.push({ ...row, top, height, idx, bottom: top + height });
                totalHeight += height;

                // TODO what with rowIndexLookup?
                this.rowIndexLookup[row.rowId] = idx;
                return rows;
            },
            [] as GridRow[]
        );
        this.columns = props.columns.reduce(
            (cols, column, idx) => {
                const left = idx === 0 || idx === props.stickyLeftColumns ? 0 : cols[idx - 1].left + cols[idx - 1].width;
                const width = column.width || DEFAULT_COLUMN_WIDTH;
                cols.push({ ...column, idx, left, width, right: left + width });
                totalWidth += width;
                // TODO what with columnIndexLookup?
                this.columnIndexLookup[column.columnId] = idx;
                return cols;
            },
            [] as GridColumn[]
        );
        this.height = totalHeight;
        this.width = totalWidth;
        this.stickyLeftRange = new Range(this.rows, this.columns.slice(0, props.stickyLeftColumns || 0));
        this.stickyTopRange = new Range(this.rows.slice(0, props.stickyTopRows || 0), this.columns);
        this.scrollableRange = new Range(this.rows.slice(props.stickyTopRows || 0), this.columns.slice(props.stickyLeftColumns || 0));
        this.first = this.getLocation(0, 0);
        this.last = this.getLocation(this.rows.length - 1, this.columns.length - 1);
    }

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

    // add validateRange

    getCell(location: Location): Cell {
        return this.rows[location.row.idx].cells[location.column.idx]
    }
}
