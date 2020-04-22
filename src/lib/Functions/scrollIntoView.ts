import { State, Direction, PointerLocation } from '../Model';
import { getScrollOfScrollableElement } from '../Functions';
import { getSizeOfElement, getVisibleSizeOfReactGrid, getReactGridOffsets } from './elementSizeHelpers';

export function scrollIntoView(state: State, location: any, direction: Direction = 'both') {
    const top = getScrollTop(state, location, direction === 'horizontal');
    const left = getScrollLeft(state, location, direction === 'vertical');

    (state.scrollableElement as HTMLElement).scrollTop !== undefined ? (state.scrollableElement as HTMLElement).scrollTop = top : state.scrollableElement!.scrollTo({ top });
    (state.scrollableElement as HTMLElement).scrollLeft !== undefined ? (state.scrollableElement as HTMLElement).scrollLeft = left : state.scrollableElement!.scrollTo({ left });
}

function getScrollTop(state: State, location: PointerLocation, dontChange: boolean): number {
    const row = location.row;
    const { stickyTopRange, rows } = state.cellMatrix;
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { height } = getSizeOfElement(state.scrollableElement);
    if (dontChange || !row) return scrollTop;

    const { visibleOffsetBottom } = getVisibleSizeOfReactGrid(state);
    const { top } = getReactGridOffsets(state);
    const visibleContentHeight = getVisibleSizeOfReactGrid(state).height;
    const visibleScrollAreaHeight = visibleContentHeight - stickyTopRange.height;

    const hasTopSticky = () => stickyTopRange.rows.length > 0;

    const isFocusLocationOnTopSticky = () => hasTopSticky() && row.idx <= stickyTopRange.last.row.idx;

    const visibleReactGridTop = Math.max(top - scrollTop, 0);

    if (isFocusLocationOnTopSticky()) {
        return scrollTop;
    }

    let visibleHeightLastRow = visibleContentHeight - state.visibleRange!.last.row.top + (visibleReactGridTop > 0 ? - scrollTop + top - visibleReactGridTop : scrollTop - top);
    if (visibleHeightLastRow > state.visibleRange!.last.row.height - 1) {
        visibleHeightLastRow = 0;
    }
    let visibleHeightFirstRow = top <= 0 ? state.visibleRange!.first.row.bottom - scrollTop : (visibleReactGridTop > 0 ? state.visibleRange!.first.row.bottom - top + scrollTop + visibleReactGridTop : state.visibleRange!.first.row.bottom - scrollTop + top);
    if (visibleHeightFirstRow > state.visibleRange!.first.row.height - 1) {
        visibleHeightFirstRow = 0;
    }
    const isTopColumnSticky = () => state.cellMatrix.stickyTopRange.rows.length > 0;

    const isColumnBelowTopPane = () => isTopColumnSticky() && row.top + top < scrollTop;
    const isLastRow = () => state.visibleRange!.last.row.idx === row.idx;
    const isVisibleOffsetBottom = () => isLastRow() && visibleOffsetBottom <= 1;
    const shouldScrollToTop = () => (row.top + (location.cellY ? location.cellY : 0) - visibleHeightFirstRow < scrollTop - top
        && !isLastRow()) || isFocusLocationOnTopSticky() || isColumnBelowTopPane();
    const shouldScrollToBottom = () => (location.cellX ? row.top + location.cellY : row.bottom) + top + visibleHeightLastRow
        > visibleScrollAreaHeight + height - visibleContentHeight + scrollTop || isVisibleOffsetBottom();

    if (shouldScrollToTop()) {
        if (hasTopSticky() || !location.cellY) {
            return row.top - 1 + top;
        } else {
            return rows[row.idx].top - 1 + top;
        }
    }
    if (shouldScrollToBottom()) {
        if (location.cellY) {
            return rows[row.idx].bottom - visibleScrollAreaHeight + 1 + top - (height - visibleContentHeight);
        } else {
            return row.bottom - visibleScrollAreaHeight + 1 + top - (height - visibleContentHeight);
        }
    }
    return scrollTop;
}

function getScrollLeft(state: State, location: PointerLocation, dontChange: boolean): number {
    const column = location.column;
    const { stickyLeftRange, columns: cols } = state.cellMatrix;
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { width } = getSizeOfElement(state.scrollableElement);
    const { visibleOffsetRight } = getVisibleSizeOfReactGrid(state);
    if (dontChange || !column) return scrollLeft;

    const { left } = getReactGridOffsets(state);
    const visibleContentWidth = getVisibleSizeOfReactGrid(state).width;
    const visibleScrollAreaWidth = visibleContentWidth - stickyLeftRange.width;

    const hasLeftSticky = () => stickyLeftRange.columns.length > 0;

    const isFocusLocationOnLeftSticky = () => hasLeftSticky() && column.idx <= stickyLeftRange.last.column.idx;

    const visibleReactGridLeft = Math.max(left - scrollLeft, 0);

    if (isFocusLocationOnLeftSticky()) {
        return scrollLeft;
    }

    let visibleWidthLastColumn = visibleContentWidth - state.visibleRange!.last.column.left + (visibleReactGridLeft > 0 ? - scrollLeft + left - visibleReactGridLeft : scrollLeft - left);
    if (visibleWidthLastColumn > state.visibleRange!.last.column.width - 1) {
        visibleWidthLastColumn = 0;
    }
    let visibleWidthFirstColumn = left <= 0 ? state.visibleRange!.first.column.right - scrollLeft : (visibleReactGridLeft > 0 ? state.visibleRange!.first.column.right - left + scrollLeft + visibleReactGridLeft : state.visibleRange!.first.column.right - scrollLeft + left);
    if (visibleWidthFirstColumn > state.visibleRange!.first.column.width - 1) {
        visibleWidthFirstColumn = 0;
    }
    const isLeftColumnSticky = () => state.cellMatrix.stickyLeftRange.columns.length > 0;

    const isColumnBelowLeftPane = () => isLeftColumnSticky() && column.left + left < scrollLeft;
    const isLastColumn = () => state.visibleRange!.last.column.idx === column.idx;
    const shouldScrollToLeft = () => (column.left + (location.cellX ? location.cellX : 0) - visibleWidthFirstColumn < scrollLeft - left
        && !isLastColumn()) || isFocusLocationOnLeftSticky() || isColumnBelowLeftPane();
    const shouldScrollToRight = () => (location.cellX ? column.left + location.cellX : column.right) + left + visibleWidthLastColumn
        > visibleScrollAreaWidth + width - visibleContentWidth + scrollLeft || (isLastColumn() && visibleOffsetRight <= 1);

    if (shouldScrollToLeft()) {
        if (hasLeftSticky() || !location.cellX) {
            return column.left - 1 + left;
        } else {
            return cols[column.idx].left - 1 + left;
        }
    }
    if (shouldScrollToRight()) {
        if (location.cellX) {
            return cols[column.idx].right - visibleScrollAreaWidth + 1 + left - (width - visibleContentWidth);
        } else {
            return column.right - visibleScrollAreaWidth + 1 + left - (width - visibleContentWidth);
        }
    }
    return scrollLeft;
}