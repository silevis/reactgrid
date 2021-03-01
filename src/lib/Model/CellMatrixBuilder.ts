import { CellMatrix, CellMatrixProps, StickyRanges, translateLocationIdxToLookupKey } from './CellMatrix';
import { GridColumn, GridRow } from './InternalModel';
import { Range } from './Range';


export interface StickyEdges {
    leftStickyColumns: number;
    topStickyRows: number;
}
export interface ICellMatrixBuilder<TCellMatrixBuilder = CellMatrixBuilder, TStickyEdges extends StickyEdges = StickyEdges> {
    setProps(props: CellMatrixProps): TCellMatrixBuilder;
    fillRowsAndCols(edges: TStickyEdges): TCellMatrixBuilder;
    fillSticky(edges: TStickyEdges): TCellMatrixBuilder;
    fillScrollableRange(edges: TStickyEdges): TCellMatrixBuilder;
    setEdgeLocations(): TCellMatrixBuilder;
}

export class CellMatrixBuilder implements ICellMatrixBuilder {

    private cellMatrix!: CellMatrix<StickyRanges>;

    constructor() {
        this.reset();
    }

    reset(): CellMatrixBuilder {
        this.cellMatrix = new CellMatrix({} as StickyRanges);
        return this;
    }

    setProps(props: CellMatrixProps): CellMatrixBuilder {
        this.cellMatrix.props = props;
        return this;
    }

    fillRowsAndCols(edges: StickyEdges = { leftStickyColumns: 0, topStickyRows: 0 }): CellMatrixBuilder {
        const { leftStickyColumns, topStickyRows } = edges;
        if (!Array.isArray(this.cellMatrix.props.rows)) {
            throw new Error('Feeded ReactGrids "rows" property is not an array!')
        }
        if (!Array.isArray(this.cellMatrix.props.columns)) {
            throw new Error('Feeded ReactGrids "columns" property is not an array!')
        }
        this.cellMatrix.rows = this.cellMatrix.props.rows.reduce<GridRow[]>(
            (rows, row, idx) => {
                const top = this.getTop(idx, topStickyRows, rows);
                const height = row.height || CellMatrix.DEFAULT_ROW_HEIGHT;
                rows.push({ ...row, top, height, idx, bottom: top + height } as GridRow);
                this.cellMatrix.height += height;
                this.cellMatrix.rowIndexLookup[row.rowId] = idx;
                return rows;
            },
            []
        );
        this.cellMatrix.columns = this.cellMatrix.props.columns.reduce<GridColumn[]>(
            (cols, column, idx) => {
                const left = this.getLeft(idx, leftStickyColumns, cols);
                const width = column.width
                    ? (column.width < CellMatrix.MIN_COLUMN_WIDTH ? CellMatrix.MIN_COLUMN_WIDTH : column.width)
                    : CellMatrix.DEFAULT_COLUMN_WIDTH;
                cols.push({ ...column, idx, left, width, right: left + width });
                this.cellMatrix.width += width;
                // TODO what with columnIndexLookup?
                this.cellMatrix.columnIndexLookup[column.columnId] = idx;
                return cols;
            },
            []
        );
        return this;
    }

    setRangesToRenderLookup(): CellMatrixBuilder {
        let rangesToExclude: Range[] = [];
        this.cellMatrix.rows.forEach((row, idy) => {
            row.cells.forEach((cell, idx) => {
                const rowspan = ("rowspan" in cell && cell.rowspan) || 0;
                const colspan = ("colspan" in cell && cell.colspan) || 0;
                const rows = rowspan ? this.cellMatrix.rows.slice(idy, idy + rowspan) : [this.cellMatrix.rows[idy]];
                const columns = colspan ? this.cellMatrix.columns.slice(idx, idx + colspan) : [this.cellMatrix.columns[idx]];
                const range = new Range(rows, columns);
                rangesToExclude = [...rangesToExclude, ...this.getRangesToRender(range)];
                this.cellMatrix.spanCellLookup[translateLocationIdxToLookupKey(idx, idy)] = { range };
            })
        });

        // TODO try to optimize by using only lookup
        const keys = rangesToExclude.map(range => translateLocationIdxToLookupKey(range.first.column.idx, range.first.row.idx));
        Object
            .keys(this.cellMatrix.spanCellLookup)
            .forEach(key => {
                if (!keys.includes(key)) {
                    this.cellMatrix.rangesToRender[key] = this.cellMatrix.spanCellLookup[key]
                }
            });
        return this;
    }

    getRangesToRender(range: Range): Range[] {
        return range.rows.flatMap(row => range.columns.map(column => new Range([row], [column]))).slice(1);
    }

    fillSticky(edges: StickyEdges = { leftStickyColumns: 0, topStickyRows: 0 }): CellMatrixBuilder {
        const { leftStickyColumns, topStickyRows } = edges;
        this.cellMatrix.ranges.stickyLeftRange = new Range(this.cellMatrix.rows,
            this.cellMatrix.columns.slice(0, leftStickyColumns || 0));
        this.cellMatrix.ranges.stickyTopRange = new Range(this.cellMatrix.rows.slice(0, topStickyRows || 0),
            this.cellMatrix.columns);
        return this;
    }

    fillScrollableRange(edges: StickyEdges = { leftStickyColumns: 0, topStickyRows: 0 }): CellMatrixBuilder {
        const { leftStickyColumns, topStickyRows } = edges;
        this.cellMatrix.scrollableRange = this.getScrollableRange({ leftStickyColumns, topStickyRows });
        return this;
    }

    setEdgeLocations(): CellMatrixBuilder {
        this.cellMatrix.first = this.cellMatrix.getLocation(0, 0);
        this.cellMatrix.last = this.cellMatrix.getLocation(this.cellMatrix.rows.length - 1,
            this.cellMatrix.columns.length - 1);
        return this;
    }

    getTop = (idx: number, stickyTopRows: number | undefined, rows: GridRow[]): number => {
        return idx === 0 || idx === stickyTopRows ? 0 : rows[idx - 1].top + rows[idx - 1].height;
    }

    getLeft = (idx: number, stickyLeftColumns: number | undefined, cols: GridColumn[]): number => {
        return idx === 0 || idx === stickyLeftColumns ? 0 : cols[idx - 1].left + cols[idx - 1].width;
    }

    getScrollableRange = (edges: StickyEdges): Range => {
        const { leftStickyColumns, topStickyRows } = edges;
        const firstScrollableRowId = !topStickyRows || topStickyRows >= this.cellMatrix.rows.length ? 0 : topStickyRows;
        const firstScrollableColumnId = !leftStickyColumns || leftStickyColumns >= this.cellMatrix.columns.length ? 0 : leftStickyColumns;
        return new Range(this.cellMatrix.rows.slice(firstScrollableRowId), this.cellMatrix.columns.slice(firstScrollableColumnId));
    }

    getCellMatrix(): CellMatrix {
        const result = this.cellMatrix;
        this.reset();
        return result;
    }

}
