import { GridColumn, GridRow, Location } from './InternalModel';
import { Cell, Column, Id, Row } from './PublicModel';
import { Range } from './Range';
export interface IndexLookup {
    [id: string]: number;
}
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
export interface Span {
    range?: Range;
}
export declare class CellMatrix<TStickyRanges extends StickyRanges = StickyRanges, TCellMatrixProps extends CellMatrixProps = CellMatrixProps> {
    ranges: TStickyRanges;
    static DEFAULT_ROW_HEIGHT: number;
    static DEFAULT_COLUMN_WIDTH: number;
    static MIN_COLUMN_WIDTH: number;
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
    spanCellLookup: {
        [location: string]: Span;
    };
    rangesToRender: {
        [location: string]: Span;
    };
    constructor(ranges: TStickyRanges);
    getRange(start: Location, end: Location): Range;
    getLocation(rowIdx: number, columnIdx: number): Location;
    getLocationById(rowId: Id, columnId: Id): Location;
    validateLocation(location: Location): Location;
    validateRange(range: Range): Range;
    getCell(location: Location): Cell;
}
export declare function translateLocationIdxToLookupKey(idx: number, idy: number): string;
