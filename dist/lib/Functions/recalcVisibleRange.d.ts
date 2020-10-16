import { State } from '../Model/State';
import { GridColumn, GridRow } from '../Model/InternalModel';
export declare const VS_PAGE_HEIGHT = 400;
export declare const VS_PAGE_WIDTH = 300;
export declare function recalcVisibleRange(state: State): State;
export declare function getVisibleScrollableSize(state: State, heights: number[], widths: number[]): {
    height: number;
    width: number;
};
export declare function getVisibleColumns(state: State, scrollableWidth: number): GridColumn[];
export declare function getVisibleRows(state: State, scrollableHeight: number): GridRow[];
