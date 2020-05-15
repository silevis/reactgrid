import { ReactGridProps, Location } from './../Model';
import { State } from './../Model/State';
import { areLocationsEqual } from './../Functions/areLocationsEqual';
import { scrollIntoView, getScrollOfScrollableElement, getVisibleScrollAreaHeight, getCalculatedScrollTopValueToBottom, getCalculatedScrollTopValueToTop, isBottomCellAllVisible, isTopCellAllVisible, isFocusLocationOnTopSticky, getVisibleScrollAreaWidth, isFocusLocationOnLeftSticky, isRightCellAllVisible, getCalculatedScrollLeftValueToRight, isLeftCellAllVisible, getCalculatedScrollLeftValueToLeft } from '.';
import { getReactGridOffsets_DEPRECATED, getStickyOffset } from '../core';

export function componentDidUpdate(prevProps: ReactGridProps, prevState: State, state: State) {
    const location = state.focusedLocation;
    if (location) {
        const shouldChangeScroll = !areLocationsEqual(location, prevState.focusedLocation)
            && !isFocusLocationOnLeftSticky(state, location)
            && !isFocusLocationOnTopSticky(state, location);
        if (shouldChangeScroll) {
            const top = getScrollTop(state, location);
            const left = getScrollLeft(state, location);
            scrollIntoView(state, top, left);
        }
    }
}

function getScrollTop(state: State, location: Location): number {
    const { stickyTopRange } = state.cellMatrix.ranges;
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const wholeStickyHeight = stickyTopRange.height;
    const visibleScrollAreaHeight = getVisibleScrollAreaHeight(state, wholeStickyHeight);
    const { top } = getReactGridOffsets_DEPRECATED(state);
    const topStickyOffset = getStickyOffset(scrollTop, top);

    if (isBottomCellAllVisible(state, location, visibleScrollAreaHeight)) {
        return getCalculatedScrollTopValueToBottom(location, visibleScrollAreaHeight, scrollTop, topStickyOffset);
    } else if (isTopCellAllVisible(state, location)) {
        return getCalculatedScrollTopValueToTop(location, scrollTop, topStickyOffset);
    }
    return scrollTop;
}

function getScrollLeft(state: State, location: Location): number {
    const { stickyLeftRange } = state.cellMatrix.ranges;
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const wholeStickyWidth = stickyLeftRange.width;
    const visibleScrollAreaWidth = getVisibleScrollAreaWidth(state, wholeStickyWidth)
    const { left } = getReactGridOffsets_DEPRECATED(state);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);

    if (isRightCellAllVisible(state, location, visibleScrollAreaWidth)) {
        return getCalculatedScrollLeftValueToRight(location, visibleScrollAreaWidth, scrollLeft, leftStickyOffset);
    } else if (isLeftCellAllVisible(state, location)) {
        return getCalculatedScrollLeftValueToLeft(location, scrollLeft, leftStickyOffset);
    }
    return scrollLeft;
}