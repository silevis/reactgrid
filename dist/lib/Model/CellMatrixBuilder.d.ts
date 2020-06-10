import { CellMatrix, CellMatrixProps, GridRow, GridColumn, Range } from '.';
export interface ICellMatrixBuilder<TCellMatrixBuilder = CellMatrixBuilder> {
    setProps(props: CellMatrixProps): TCellMatrixBuilder;
    fillRowsAndCols(): TCellMatrixBuilder;
    fillSticky(): TCellMatrixBuilder;
    fillScrollableRange(): TCellMatrixBuilder;
    setEdgeLocations(): TCellMatrixBuilder;
}
export declare class CellMatrixBuilder implements ICellMatrixBuilder {
    private cellMatrix;
    constructor();
    reset(): CellMatrixBuilder;
    setProps(props: CellMatrixProps): CellMatrixBuilder;
    fillRowsAndCols(): CellMatrixBuilder;
    fillSticky(): CellMatrixBuilder;
    fillScrollableRange(): CellMatrixBuilder;
    setEdgeLocations(): CellMatrixBuilder;
    getTop: (idx: number, stickyTopRows: number | undefined, rows: GridRow[]) => number;
    getLeft: (idx: number, stickyLeftColumns: number | undefined, cols: GridColumn[]) => number;
    getScrollableRange: () => Range;
    getCellMatrix(): CellMatrix;
}
