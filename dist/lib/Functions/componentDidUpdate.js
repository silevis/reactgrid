import { areLocationsEqual } from './../Functions/areLocationsEqual';
import { scrollIntoView, getScrollOfScrollableElement, getVisibleScrollAreaHeight, getCalculatedScrollTopValueToBottom, getCalculatedScrollTopValueToTop, isBottomCellAllVisible, isTopCellAllVisible, isFocusLocationOnTopSticky, getVisibleScrollAreaWidth, isFocusLocationOnLeftSticky, isRightCellAllVisible, getCalculatedScrollLeftValueToRight, isLeftCellAllVisible, getCalculatedScrollLeftValueToLeft } from '.';
import { getReactGridOffsets, getStickyOffset } from '../core';
export function componentDidUpdate(prevProps, prevState, state) {
    var location = state.focusedLocation;
    if (location) {
        var shouldChangeScroll = !areLocationsEqual(location, prevState.focusedLocation)
            && !isFocusLocationOnLeftSticky(state, location)
            && !isFocusLocationOnTopSticky(state, location);
        if (shouldChangeScroll) {
            var top_1 = getScrollTop(state, location);
            var left = getScrollLeft(state, location);
            scrollIntoView(state, top_1, left);
        }
    }
}
function getScrollTop(state, location) {
    var stickyTopRange = state.cellMatrix.ranges.stickyTopRange;
    var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
    var wholeStickyHeight = stickyTopRange.height;
    var visibleScrollAreaHeight = getVisibleScrollAreaHeight(state, wholeStickyHeight);
    var top = getReactGridOffsets(state).top;
    var topStickyOffset = getStickyOffset(scrollTop, top);
    if (isBottomCellAllVisible(state, location, visibleScrollAreaHeight)) {
        return getCalculatedScrollTopValueToBottom(location, visibleScrollAreaHeight, scrollTop, topStickyOffset);
    }
    else if (isTopCellAllVisible(state, location)) {
        return getCalculatedScrollTopValueToTop(location, scrollTop, topStickyOffset);
    }
    return scrollTop;
}
function getScrollLeft(state, location) {
    var stickyLeftRange = state.cellMatrix.ranges.stickyLeftRange;
    var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
    var wholeStickyWidth = stickyLeftRange.width;
    var visibleScrollAreaWidth = getVisibleScrollAreaWidth(state, wholeStickyWidth);
    var left = getReactGridOffsets(state).left;
    var leftStickyOffset = getStickyOffset(scrollLeft, left);
    if (isRightCellAllVisible(state, location, visibleScrollAreaWidth)) {
        return getCalculatedScrollLeftValueToRight(location, visibleScrollAreaWidth, scrollLeft, leftStickyOffset);
    }
    else if (isLeftCellAllVisible(state, location)) {
        return getCalculatedScrollLeftValueToLeft(location, scrollLeft, leftStickyOffset);
    }
    return scrollLeft;
}
