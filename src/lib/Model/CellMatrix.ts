import { Range } from './Range';
import { Location, GridRow, GridColumn } from '.';
import { AbstractCellMatrix, AbstractCellMatrixProps, IndexLookup } from './AbstractCellMatrix';

// INTERNAL
export class CellMatrix extends AbstractCellMatrix {
    readonly stickyTopRange: Range;
    readonly stickyLeftRange: Range;
    readonly scrollableRange: Range;
    readonly width: number = 0;
    readonly height: number = 0;

    readonly columns: GridColumn[];
    readonly rows: GridRow[];
    readonly first: Location;
    readonly last: Location;

    protected readonly rowIndexLookup: IndexLookup = {};
    protected readonly columnIndexLookup: IndexLookup = {};

    constructor(public readonly props: AbstractCellMatrixProps) {
        super(props);
        let totalHeight = 0,
            totalWidth = 0;

        this.rows = props.rows.reduce(
            (rows, row, idx) => {
                const top = this.getTop(idx, props.stickyTopRows, rows);
                const height = row.height || AbstractCellMatrix.DEFAULT_ROW_HEIGHT;
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
                const left = this.getLeft(idx, props.stickyLeftColumns, cols);
                const width = column.width || AbstractCellMatrix.DEFAULT_COLUMN_WIDTH;
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
        this.scrollableRange = this.getScrollableRange();
        this.first = this.getLocation(0, 0);
        this.last = this.getLocation(this.rows.length - 1, this.columns.length - 1);
    }

    private getTop = (idx: number, stickyTopRows: number | undefined, rows: GridRow[]): number => {
        return idx === 0 || idx === stickyTopRows ? 0 : rows[idx - 1].top + rows[idx - 1].height;
    }

    private getLeft = (idx: number, stickyLeftColumns: number | undefined, cols: GridColumn[]): number => {
        return idx === 0 || idx === stickyLeftColumns ? 0 : cols[idx - 1].left + cols[idx - 1].width;
    }

    private getScrollableRange = (): Range => {
        return new Range(this.rows.slice(this.props.stickyTopRows || 0), this.columns.slice(this.props.stickyLeftColumns || 0));
    }

}
