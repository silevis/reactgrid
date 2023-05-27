import { CellMatrix, CellMatrixProps } from './CellMatrix';
import { Range } from './Range';
export interface StickyEdges {
    leftStickyColumns: number;
    topStickyRows: number;
    rightStickyColumns: number;
    bottomStickyRows: number;
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
    private reset;
    setProps(props: CellMatrixProps): CellMatrixBuilder;
    fillRowsAndCols(edges?: StickyEdges): CellMatrixBuilder;
    setRangesToRenderLookup(): CellMatrixBuilder;
    getRangesToRender(range: Range): Range[];
    fillSticky(edges?: StickyEdges): CellMatrixBuilder;
    fillScrollableRange(edges?: StickyEdges): CellMatrixBuilder;
    setEdgeLocations(): CellMatrixBuilder;
    private getTop;
    private getLeft;
    private getScrollableRange;
    private getStickyBottomFirstIdx;
    private getStickyRightFirstIdx;
    getCellMatrix(): CellMatrix;
}
