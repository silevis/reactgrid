import { Id } from './PublicModel';
import { Range } from './Range';
import { Column, Row, Location, Cell, GridRow, GridColumn } from '.';
export interface CellMatrixProps {
    columns: Column[];
    rows: Row[];
    stickyTopRows?: number;
    stickyLeftColumns?: number;
}
export declare class CellMatrix {
    readonly props: CellMatrixProps;
    readonly stickyTopRange: Range;
    readonly stickyLeftRange: Range;
    readonly scrollableRange: Range;
    readonly width: number;
    readonly height: number;
    readonly columns: GridColumn[];
    readonly rows: GridRow[];
    readonly first: Location;
    readonly last: Location;
    private readonly rowIndexLookup;
    private readonly columnIndexLookup;
    constructor(props: CellMatrixProps);
    getRange(start: Location, end: Location): Range;
    getLocation(rowIdx: number, columnIdx: number): Location;
    getLocationById(rowId: Id, columnId: Id): Location;
    validateLocation(location: Location): Location;
    getCell(location: Location): Cell;
}
