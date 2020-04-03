import { GridColumn, GridRow, Range, State } from '../Model';
import { getScrollOfScrollableElement } from '.';
import { getVisibleSizeOfReactGrid, getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';

export function recalcVisibleRange(state: State): State {
    const cellMatrix = state.cellMatrix;
    const { scrollTop, scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { height, width } = getVisibleSizeOfReactGrid(state);
    const visibleScrollableAreaHeight = Math.max(height - cellMatrix.stickyTopRange.height, 0);
    const visibleScrollableAreaWidth = Math.max(width - cellMatrix.stickyLeftRange.width, 0);
    const { top, left } = getReactGridOffsets(state);
    // TODO improve calculation of visibleCols & visibleRows - this filter is very inefficient for big tables
    const visibleColumns = cellMatrix.scrollableRange.columns.filter((col: GridColumn) => col.right >= scrollLeft - left && col.left <= visibleScrollableAreaWidth + getStickyOffset(scrollLeft, left));
    const visibleRows = cellMatrix.scrollableRange.rows.filter((row: GridRow) => row.bottom >= scrollTop - top && row.top <= visibleScrollableAreaHeight + getStickyOffset(scrollTop, top))
    const visibleRange = new Range(visibleRows, visibleColumns);
    return {
        ...state,
        // TODO should '0' be replaced by offset____ and visibleScrollableArea____ ?
        minScrollLeft: visibleRange.first.column === undefined ? 0 : visibleRange.first.column.left + left,
        maxScrollLeft: visibleRange.last.column === undefined ? 0 : visibleRange.last.column.right - visibleScrollableAreaWidth + left,
        minScrollTop: visibleRows.length > 0 ? visibleRange.first.row.top + top : 0,
        maxScrollTop: visibleColumns.length > 0 ? (visibleRange.last.row === undefined ? 0 : visibleRange.last.row.bottom - visibleScrollableAreaHeight + top) : 0,
        visibleRange
    };
}
