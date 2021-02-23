import { Location } from './../Model/InternalModel';
import { State } from './../Model/State';
import { ReactGridProps } from './../Model/PublicModel';
import { areLocationsEqual } from './areLocationsEqual';
import { getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';
import { getScrollOfScrollableElement } from './scrollHelpers';
import {
    getCalculatedScrollLeftValueToLeft, getCalculatedScrollLeftValueToRight, getCalculatedScrollTopValueToBottom,
    getCalculatedScrollTopValueToTop, getVisibleScrollAreaHeight, getVisibleScrollAreaWidth, isBottomCellAllVisible,
    isFocusLocationOnLeftSticky, isFocusLocationOnTopSticky, isLeftCellAllVisible, isRightCellAllVisible,
    isTopCellAllVisible, scrollIntoView
} from './scrollIntoView';

//TODO what about initialFocusLocation and focusLocation set by props
export function componentDidUpdate(prevProps: ReactGridProps, prevState: State, state: State): void {
    const location = state.focusedLocation;
    if (location) {
        const shouldChangeScroll = !areLocationsEqual(location, prevState.focusedLocation);
        const wasCellEditorOpened = state.currentlyEditedCell !== undefined && state.currentlyEditedCell !== prevState.currentlyEditedCell;
        if (shouldChangeScroll || wasCellEditorOpened) {
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
    const { top } = getReactGridOffsets(state);
    const topStickyOffset = getStickyOffset(scrollTop, top);
    if (isFocusLocationOnTopSticky(state, location)) {
        return scrollTop;
    }
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
    const { left } = getReactGridOffsets(state);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);
    if (isFocusLocationOnLeftSticky(state, location)) {
        return scrollLeft;
    }
    if (isRightCellAllVisible(state, location, visibleScrollAreaWidth)) {
        return getCalculatedScrollLeftValueToRight(location, visibleScrollAreaWidth, scrollLeft, leftStickyOffset);
    } else if (isLeftCellAllVisible(state, location)) {
        return getCalculatedScrollLeftValueToLeft(location, scrollLeft, leftStickyOffset);
    }
    return scrollLeft;
}
