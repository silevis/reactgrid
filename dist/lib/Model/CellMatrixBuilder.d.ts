import { CellMatrix, CellMatrixProps } from './CellMatrix';
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
export declare class CellMatrixBuilder implements ICellMatrixBuilder {
    private cellMatrix;
    constructor();
    reset(): CellMatrixBuilder;
    setProps(props: CellMatrixProps): CellMatrixBuilder;
    fillRowsAndCols(edges?: StickyEdges): CellMatrixBuilder;
    fillSticky(edges?: StickyEdges): CellMatrixBuilder;
    fillScrollableRange(edges?: StickyEdges): CellMatrixBuilder;
    setEdgeLocations(): CellMatrixBuilder;
    getTop: (idx: number, stickyTopRows: number | undefined, rows: GridRow[]) => number;
    getLeft: (idx: number, stickyLeftColumns: number | undefined, cols: GridColumn[]) => number;
    getScrollableRange: (edges: StickyEdges) => Range;
    getCellMatrix(): CellMatrix;
}
