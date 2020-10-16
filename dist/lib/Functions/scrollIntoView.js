import { getScrollOfScrollableElement } from './scrollHelpers';
import { getVisibleSizeOfReactGrid, getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';
export function scrollIntoView(state, top, left) {
    var scrollableElement = state.scrollableElement;
    scrollableElement.scrollTop !== undefined ? scrollableElement.scrollTop = top : scrollableElement.scrollTo({ top: top });
    scrollableElement.scrollLeft !== undefined ? scrollableElement.scrollLeft = left : scrollableElement.scrollTo({ left: left });
}
export function getVisibleScrollAreaHeight(state, wholeStickyHeight) {
    var visibleContentHeight = getVisibleSizeOfReactGrid(state).height;
    return visibleContentHeight - wholeStickyHeight;
}
export function getCalculatedScrollTopValueToBottom(location, visibleScrollAreaHeight, scrollTop, topStickyOffset) {
    return scrollTop + location.row.bottom - visibleScrollAreaHeight - topStickyOffset;
}
export function getCalculatedScrollTopValueToTop(location, scrollTop, topStickyOffset) {
    return scrollTop - topStickyOffset + location.row.top - 1;
}
export function isBottomCellAllVisible(state, location, visibleScrollAreaHeight) {
    var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
    var top = getReactGridOffsets(state).top;
    var topStickyOffset = getStickyOffset(scrollTop, top);
    return visibleScrollAreaHeight < location.row.bottom - topStickyOffset;
}
export function isTopCellAllVisible(state, location) {
    var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
    var top = getReactGridOffsets(state).top;
    var topStickyOffset = getStickyOffset(scrollTop, top);
    return location.row.top < topStickyOffset;
}
export function isFocusLocationOnTopSticky(state, location) {
    var stickyTopRange = state.cellMatrix.ranges.stickyTopRange;
    var row = location.row;
    return stickyTopRange.rows.length > 0 && row.idx <= stickyTopRange.last.row.idx;
}
export function getVisibleScrollAreaWidth(state, wholeStickyWidth) {
    var visibleContentWidth = getVisibleSizeOfReactGrid(state).width;
    return visibleContentWidth - wholeStickyWidth;
}
export function getCalculatedScrollLeftValueToRight(location, visibleScrollAreaWidth, scrollLeft, leftStickyOffset) {
    return scrollLeft + location.column.right - visibleScrollAreaWidth - leftStickyOffset;
}
export function getCalculatedScrollLeftValueToLeft(location, scrollLeft, leftStickyOffset) {
    return scrollLeft - leftStickyOffset + location.column.left - 1;
}
export function isRightCellAllVisible(state, location, visibleScrollAreaWidth) {
    var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
    var left = getReactGridOffsets(state).left;
    var leftStickyOffset = getStickyOffset(scrollLeft, left);
    return visibleScrollAreaWidth < location.column.right - leftStickyOffset;
}
export function isLeftCellAllVisible(state, location) {
    var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
    var left = getReactGridOffsets(state).left;
    var leftStickyOffset = getStickyOffset(scrollLeft, left);
    return location.column.left < leftStickyOffset;
}
export function isFocusLocationOnLeftSticky(state, location) {
    var stickyLeftRange = state.cellMatrix.ranges.stickyLeftRange;
    var column = location.column;
    return stickyLeftRange.columns.length > 0 && column.idx <= stickyLeftRange.last.column.idx;
}
