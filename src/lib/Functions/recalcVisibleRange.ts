import { Range, State, GridColumn, GridRow } from '../Model';
import { getScrollOfScrollableElement } from '.';
import { getVisibleSizeOfReactGrid, getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';

export function recalcVisibleRange(state: State): State {
    const { scrollTop, scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { height, width } = getVisibleSizeOfReactGrid(state);
    const { width: visibleScrollableWidth, height: visibleScrollableHeight } =
        getVisibleScrollableSize(state, [height, -state.cellMatrix.stickyTopRange.height], [width, -state.cellMatrix.stickyLeftRange.width]);
    const { top: topOffset, left: leftOffset } = getReactGridOffsets(state);
    // TODO improve calculation of visibleCols & visibleRows - this filter is very inefficient for big tables
    const visibleColumns = getVisibleColumns(state, scrollLeft, leftOffset, visibleScrollableWidth);
    const visibleRows = getVisibleRows(state, scrollTop, topOffset, visibleScrollableHeight);
    const visibleRange = new Range(visibleRows, visibleColumns);
    return {
        ...state,
        // TODO should '0' be replaced by offset____ and visibleScrollableArea____ ?
        minScrollLeft: visibleRange.first.column === undefined ? 0 : visibleRange.first.column.left + leftOffset,
        maxScrollLeft: visibleRange.last.column === undefined ? 0 : visibleRange.last.column.right - visibleScrollableWidth + leftOffset,
        minScrollTop: visibleRows.length > 0 ? visibleRange.first.row.top + topOffset : 0,
        maxScrollTop: visibleColumns.length > 0 ? (visibleRange.last.row === undefined ? 0 : visibleRange.last.row.bottom - visibleScrollableHeight + topOffset) : 0,
        visibleRange
    };
}

export function getVisibleScrollableSize(state: State, heights: number[], widths: number[]): { height: number, width: number } {
    const sum = (a: number, b: number) => a + b;
    return {
        height: Math.max(heights.reduce(sum, 0), 0),
        width: Math.max(widths.reduce(sum, 0), 0)
    }
}

function getVisibleColumns(state: State, scrollLeft: number, leftOffset: number, scrollableWidth: number): GridColumn[] {
    const rangeFilter = (col: GridColumn) => col.right >= scrollLeft - leftOffset && col.left <= scrollableWidth + getStickyOffset(scrollLeft, leftOffset)
    return state.cellMatrix.scrollableRange.columns.filter(rangeFilter);
}

function getVisibleRows(state: State, scrollTop: number, topOffset: number, scrollableHeight: number): GridRow[] {
    const rangeFilter = (row: GridRow) => row.bottom >= scrollTop - topOffset && row.top <= scrollableHeight + getStickyOffset(scrollTop, topOffset)
    return state.cellMatrix.scrollableRange.rows.filter(rangeFilter);
}