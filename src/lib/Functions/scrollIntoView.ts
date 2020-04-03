import { State, Direction, PointerLocation } from '../Model';
import { getScrollOfScrollableElement } from '../Functions';
import { getSizeOfElement, getVisibleSizeOfReactGrid, getReactGridOffsets } from './elementSizeHelpers';

export function scrollIntoView(state: State, location: any, direction: Direction = 'both') {
    const top = getScrollTop(state, location, direction === 'horizontal');
    const left = getScrollLeft(state, location, direction === 'vertical');

    (state.scrollableElement as HTMLElement).scrollTop !== undefined ? (state.scrollableElement as HTMLElement).scrollTop = top : state.scrollableElement.scrollTo({ top });
    (state.scrollableElement as HTMLElement).scrollLeft !== undefined ? (state.scrollableElement as HTMLElement).scrollLeft = left : state.scrollableElement.scrollTo({ left });
}

function getScrollTop(state: State, location: PointerLocation, dontChange: boolean): number {
    const row = location.row;
    const { stickyTopRange, rows } = state.cellMatrix;
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { height } = getSizeOfElement(state.scrollableElement);
    if (dontChange || !row) return scrollTop;
    const { top } = getReactGridOffsets(state);
    const visibleContentHeight = getVisibleSizeOfReactGrid(state).height;
    const visibleScrollAreaHeight = visibleContentHeight - stickyTopRange.height;

    const hasTopSticky = () => stickyTopRange.rows.length > 0;

    const isFocusLocationOnTopSticky = () => hasTopSticky() && row.idx <= stickyTopRange.last.row.idx;

    if (isFocusLocationOnTopSticky()) {
        return scrollTop;
    }

    const isRowBelowTopPane = () => row.top < scrollTop;

    const isLastRow = () => state.visibleRange.last.row.idx === row.idx;
    const shouldScrollToTop = () => row.top + (location.cellY ? location.cellY : 0) < scrollTop + 1
        || isRowBelowTopPane();

    const shouldScrollToBottom = () => (location.cellY ? row.top + location.cellY : row.bottom) > visibleScrollAreaHeight + scrollTop - 4
        || isLastRow();
    if (shouldScrollToTop()) {
        return rows[row.idx].top - 1 + top;
    }
    if (shouldScrollToBottom()) {
        return rows[row.idx].bottom - visibleScrollAreaHeight + 1 + top - (height - visibleContentHeight);
    }

    return scrollTop;
}

function getScrollLeft(state: State, location: PointerLocation, dontChange: boolean): number {
    const column = location.column;
    const { stickyLeftRange, columns: cols } = state.cellMatrix;
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { width } = getSizeOfElement(state.scrollableElement);
    if (dontChange || !column) return scrollLeft;

    const { left } = getReactGridOffsets(state);
    const visibleContentWidth = getVisibleSizeOfReactGrid(state).width;
    const visibleScrollAreaWidth = visibleContentWidth - stickyLeftRange.width;

    const hasLeftSticky = () => stickyLeftRange.columns.length > 0;

    const isFocusLocationOnLeftSticky = () => hasLeftSticky() && column.idx <= stickyLeftRange.last.column.idx;

    if (isFocusLocationOnLeftSticky()) {
        return scrollLeft;
    }

    const isColumnBelowLeftPane = () => column.left < scrollLeft;
    const isLastColumn = () => state.visibleRange.last.column.idx === column.idx;
    const shouldScrollToLeft = () => column.left + (location.cellX ? location.cellX : 0) < scrollLeft + 1
        || isColumnBelowLeftPane();
    const shouldScrollToRight = () => (location.cellX ? column.left + location.cellX : column.right) > visibleScrollAreaWidth + scrollLeft - 4
        || isLastColumn();

    if (shouldScrollToLeft()) {
        return cols[column.idx].left - 1 + left;
    }
    if (shouldScrollToRight()) {
        return cols[column.idx].right - visibleScrollAreaWidth + 1 + left - (width - visibleContentWidth);
    }
    return scrollLeft;
}