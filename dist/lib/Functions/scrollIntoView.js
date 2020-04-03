import { getScrollOfScrollableElement } from '../Functions';
import { getSizeOfElement, getVisibleSizeOfReactGrid, getReactGridOffsets } from './elementSizeHelpers';
export function scrollIntoView(state, location, direction) {
    if (direction === void 0) { direction = 'both'; }
    var top = getScrollTop(state, location, direction === 'horizontal');
    var left = getScrollLeft(state, location, direction === 'vertical');
    state.scrollableElement.scrollTop !== undefined ? state.scrollableElement.scrollTop = top : state.scrollableElement.scrollTo({ top: top });
    state.scrollableElement.scrollLeft !== undefined ? state.scrollableElement.scrollLeft = left : state.scrollableElement.scrollTo({ left: left });
}
function getScrollTop(state, location, dontChange) {
    var row = location.row;
    var _a = state.cellMatrix, stickyTopRange = _a.stickyTopRange, rows = _a.rows;
    var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
    var height = getSizeOfElement(state.scrollableElement).height;
    if (dontChange || !row)
        return scrollTop;
    var top = getReactGridOffsets(state).top;
    var visibleContentHeight = getVisibleSizeOfReactGrid(state).height;
    var visibleScrollAreaHeight = visibleContentHeight - stickyTopRange.height;
    var hasTopSticky = function () { return stickyTopRange.rows.length > 0; };
    var isFocusLocationOnTopSticky = function () { return hasTopSticky() && row.idx <= stickyTopRange.last.row.idx; };
    if (isFocusLocationOnTopSticky()) {
        return scrollTop;
    }
    var isRowBelowTopPane = function () { return row.top < scrollTop; };
    var isLastRow = function () { return state.visibleRange.last.row.idx === row.idx; };
    var shouldScrollToTop = function () { return row.top + (location.cellY ? location.cellY : 0) < scrollTop + 1
        || isRowBelowTopPane(); };
    var shouldScrollToBottom = function () { return (location.cellY ? row.top + location.cellY : row.bottom) > visibleScrollAreaHeight + scrollTop - 4
        || isLastRow(); };
    if (shouldScrollToTop()) {
        return rows[row.idx].top - 1 + top;
    }
    if (shouldScrollToBottom()) {
        return rows[row.idx].bottom - visibleScrollAreaHeight + 1 + top - (height - visibleContentHeight);
    }
    return scrollTop;
}
function getScrollLeft(state, location, dontChange) {
    var column = location.column;
    var _a = state.cellMatrix, stickyLeftRange = _a.stickyLeftRange, cols = _a.columns;
    var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
    var width = getSizeOfElement(state.scrollableElement).width;
    if (dontChange || !column)
        return scrollLeft;
    var left = getReactGridOffsets(state).left;
    var visibleContentWidth = getVisibleSizeOfReactGrid(state).width;
    var visibleScrollAreaWidth = visibleContentWidth - stickyLeftRange.width;
    var hasLeftSticky = function () { return stickyLeftRange.columns.length > 0; };
    var isFocusLocationOnLeftSticky = function () { return hasLeftSticky() && column.idx <= stickyLeftRange.last.column.idx; };
    if (isFocusLocationOnLeftSticky()) {
        return scrollLeft;
    }
    var isColumnBelowLeftPane = function () { return column.left < scrollLeft; };
    var isLastColumn = function () { return state.visibleRange.last.column.idx === column.idx; };
    var shouldScrollToLeft = function () { return column.left + (location.cellX ? location.cellX : 0) < scrollLeft + 1
        || isColumnBelowLeftPane(); };
    var shouldScrollToRight = function () { return (location.cellX ? column.left + location.cellX : column.right) > visibleScrollAreaWidth + scrollLeft - 4
        || isLastColumn(); };
    if (shouldScrollToLeft()) {
        return cols[column.idx].left - 1 + left;
    }
    if (shouldScrollToRight()) {
        return cols[column.idx].right - visibleScrollAreaWidth + 1 + left - (width - visibleContentWidth);
    }
    return scrollLeft;
}
