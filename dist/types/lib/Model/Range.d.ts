import { GridColumn, GridRow, Location } from './InternalModel';
export type SliceDirection = 'columns' | 'rows' | 'both';
export declare class Range {
    readonly rows: GridRow[];
    readonly columns: GridColumn[];
    readonly width: number;
    readonly height: number;
    readonly first: Location;
    readonly last: Location;
    constructor(rows: GridRow[], columns: GridColumn[]);
    contains(location: Location): boolean;
    slice(range: Range, direction: SliceDirection): Range;
}
