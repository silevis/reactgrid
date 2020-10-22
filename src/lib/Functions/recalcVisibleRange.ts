import { Range } from '../Model/Range';
import { State } from '../Model/State';
import { GridColumn, GridRow } from '../Model/InternalModel';
import { getScrollOfScrollableElement } from './scrollHelpers';
import { getVisibleSizeOfReactGrid, getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';

export const VS_PAGE_HEIGHT = 400;
export const VS_PAGE_WIDTH = 300;
const ADDITONAL_INDEX = 1; // is needed for getting last element in array

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
    const { columns } = state.cellMatrix.scrollableRange;
    const { left } = getReactGridOffsets(state);
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const firstIndex = Math.max(colBinarySearch(columns, scrollLeft - left - VS_PAGE_WIDTH) - ADDITONAL_INDEX - 1, 0);
    const lastIndex = colBinarySearch(columns, scrollableWidth + getStickyOffset(scrollLeft, left) + VS_PAGE_WIDTH, firstIndex);
    return columns.slice(firstIndex, lastIndex + ADDITONAL_INDEX);
}

export function getVisibleRows(state: State, scrollableHeight: number): GridRow[] {
    const { rows } = state.cellMatrix.scrollableRange;
    const { top } = getReactGridOffsets(state);
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const firstIndex = Math.max(rowBinarySearch(rows, scrollTop - top - VS_PAGE_HEIGHT) - ADDITONAL_INDEX - 1, 0);
    const lastIndex = rowBinarySearch(rows, scrollableHeight + getStickyOffset(scrollTop, top) + VS_PAGE_HEIGHT, firstIndex);
    return rows.slice(firstIndex, lastIndex + ADDITONAL_INDEX);
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