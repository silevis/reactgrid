import { PointerLocation, GridRow, GridColumn, Direction, State } from '../Model';
export declare function getLocationFromClient(state: State, clientX: number, clientY: number, favorScrollableContent?: Direction): PointerLocation;
export declare function getStickyTopRow(state: State, viewportY: number, favorScrollableContent: boolean): {
    cellY: number;
    row: GridRow;
} | undefined;
export declare function getLeftStickyColumn(state: State, viewportX: number, favorScrollableContent: boolean): {
    cellX: number;
    column: GridColumn;
} | undefined;
export declare function getScrollableContentRow(state: State, viewportY: number): {
    cellY: number;
    row: GridRow;
};
export declare function getScrollableContentColumn(state: State, viewportX: number): {
    cellX: number;
    column: GridColumn;
};
