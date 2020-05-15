import { Range, State, GridColumn, GridRow } from '../Model';
import { getScrollOfScrollableElement } from './scrollHelpers';
import { getVisibleSizeOfReactGrid, getReactGridOffsets_DEPRECATED, getStickyOffset } from './elementSizeHelpers';

export const VS_PAGE_HEIGHT = 300;
export const VS_PAGE_WIDTH = 300;

export function recalcVisibleRange(state: State): State {
    const { scrollTop, scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { width, height } = getVisibleScrollableSize(state,
        [-state.cellMatrix.ranges.stickyTopRange.height], [-state.cellMatrix.ranges.stickyLeftRange.width]);
    const visibleColumns = getVisibleColumns(state, width);
    const visibleRows = getVisibleRows(state, height);
    const visibleRange = new Range(visibleRows, visibleColumns);
    return {
        ...state,
        leftScrollBoudary: visibleRange.columns.length > 0 ? scrollLeft - VS_PAGE_WIDTH : 0,
        rightScrollBoudary: visibleRange.last.column === undefined ? 0 : VS_PAGE_WIDTH + scrollLeft,
        topScrollBoudary: visibleRange.columns.length > 0 ? scrollTop - VS_PAGE_HEIGHT : 0,
        bottomScrollBoudary: visibleRange.last.row === undefined ? 0 : VS_PAGE_HEIGHT + scrollTop,
        visibleRange
    };
}

export function getVisibleScrollableSize(state: State, heights: number[], widths: number[]): { height: number, width: number } {
    const { height, width } = getVisibleSizeOfReactGrid(state);
    const sum = (a: number, b: number) => a + b;
    return {
        height: Math.max(heights.reduce(sum, height), 0),
        width: Math.max(widths.reduce(sum, width), 0)
    }
}

export function getVisibleColumns(state: State, scrollableWidth: number): GridColumn[] {
    const { left } = getReactGridOffsets_DEPRECATED(state);
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const firstIndex = colBinarySearch(state.cellMatrix.scrollableRange.columns, scrollLeft - left - VS_PAGE_HEIGHT);
    const lastIndex = colBinarySearch(state.cellMatrix.scrollableRange.columns,
        scrollableWidth + getStickyOffset(scrollLeft, left) + VS_PAGE_HEIGHT, firstIndex);
    return state.cellMatrix.scrollableRange.columns.slice(firstIndex, lastIndex + 1);
}

export function getVisibleRows(state: State, scrollableHeight: number): GridRow[] {
    const { top } = getReactGridOffsets_DEPRECATED(state);
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const firstIndex = rowBinarySearch(state.cellMatrix.scrollableRange.rows, scrollTop - top - VS_PAGE_HEIGHT);
    const lastIndex = rowBinarySearch(state.cellMatrix.scrollableRange.rows,
        scrollableHeight + getStickyOffset(scrollTop, top) + VS_PAGE_HEIGHT, firstIndex);
    return state.cellMatrix.scrollableRange.rows.slice(firstIndex, lastIndex + 1);
}

function rowBinarySearch(arr: GridRow[], val: number, start = 0, end = arr.length - 1): number {
    const mid = (start + end) >> 1;
    if (mid < 0)
        return 0;
    if (start >= end)
        return mid;
    return val < arr[mid].top
        ? rowBinarySearch(arr, val, start, mid)
        : rowBinarySearch(arr, val, mid + 1, end);
}

function colBinarySearch(arr: GridColumn[], val: number, start = 0, end = arr.length - 1): number {
    const mid = (start + end) >> 1;;
    if (mid < 0)
        return 0;
    if (start >= end)
        return mid;
    return val < arr[mid].left
        ? colBinarySearch(arr, val, start, mid)
        : colBinarySearch(arr, val, mid + 1, end);
}