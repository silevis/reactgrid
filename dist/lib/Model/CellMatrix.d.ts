import { Location, GridRow, GridColumn, Id, Range, Cell, Column, Row } from '.';
export interface IndexLookup {
    [id: string]: number;
}
export interface CellMatrixProps {
    columns: Column[];
    rows: Row[];
    stickyTopRows?: number;
    stickyLeftColumns?: number;
}
export interface StickyRanges {
    stickyTopRange: Range;
    stickyLeftRange: Range;
}
export declare class CellMatrix<TStickyRanges extends StickyRanges = StickyRanges, TCellMatrixProps extends CellMatrixProps = CellMatrixProps> {
    ranges: TStickyRanges;
    static DEFAULT_ROW_HEIGHT: number;
    static DEFAULT_COLUMN_WIDTH: number;
    props: TCellMatrixProps;
    scrollableRange: Range;
    width: number;
    height: number;
    columns: GridColumn[];
    rows: GridRow[];
    first: Location;
    last: Location;
    rowIndexLookup: IndexLookup;
    columnIndexLookup: IndexLookup;
    constructor(ranges: TStickyRanges);
    getRange(start: Location, end: Location): Range;
    getLocation(rowIdx: number, columnIdx: number): Location;
    getLocationById(rowId: Id, columnId: Id): Location;
    validateLocation(location: Location): Location;
    validateRange(range: Range): Range;
    getCell(location: Location): Cell;
}
