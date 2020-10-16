import { Location } from '../Model/InternalModel';
import { State } from '../Model/State';
import { getScrollOfScrollableElement } from './scrollHelpers';
import { getVisibleSizeOfReactGrid, getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';

export function scrollIntoView(state: State, top: number, left: number) {
    const scrollableElement = state.scrollableElement as HTMLElement;
    scrollableElement.scrollTop !== undefined ? scrollableElement.scrollTop = top : scrollableElement!.scrollTo({ top });
    scrollableElement.scrollLeft !== undefined ? scrollableElement.scrollLeft = left : scrollableElement!.scrollTo({ left });
}

export function getVisibleScrollAreaHeight(state: State, wholeStickyHeight: number): number {
    const visibleContentHeight = getVisibleSizeOfReactGrid(state).height;
    return visibleContentHeight - wholeStickyHeight;
}

export function getCalculatedScrollTopValueToBottom(location: Location, visibleScrollAreaHeight: number, scrollTop: number, topStickyOffset: number): number {
    return scrollTop + location.row.bottom - visibleScrollAreaHeight - topStickyOffset;
}

export function getCalculatedScrollTopValueToTop(location: Location, scrollTop: number, topStickyOffset: number): number {
    return scrollTop - topStickyOffset + location.row.top - 1;
}

export function isBottomCellAllVisible(state: State, location: Location, visibleScrollAreaHeight: number) {
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { top } = getReactGridOffsets(state);
    const topStickyOffset = getStickyOffset(scrollTop, top);
    return visibleScrollAreaHeight < location.row.bottom - topStickyOffset;
}

export function isTopCellAllVisible(state: State, location: Location) {
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { top } = getReactGridOffsets(state);
    const topStickyOffset = getStickyOffset(scrollTop, top);
    return location.row.top < topStickyOffset;
}

export function isFocusLocationOnTopSticky(state: State, location: Location) {
    const { stickyTopRange } = state.cellMatrix.ranges;
    const row = location.row;
    return stickyTopRange.rows.length > 0 && row.idx <= stickyTopRange.last.row.idx;
}

export function getVisibleScrollAreaWidth(state: State, wholeStickyWidth: number): number {
    const visibleContentWidth = getVisibleSizeOfReactGrid(state).width;
    return visibleContentWidth - wholeStickyWidth;
}

export function getCalculatedScrollLeftValueToRight(location: Location, visibleScrollAreaWidth: number, scrollLeft: number, leftStickyOffset: number): number {
    return scrollLeft + location.column.right - visibleScrollAreaWidth - leftStickyOffset;
}

export function getCalculatedScrollLeftValueToLeft(location: Location, scrollLeft: number, leftStickyOffset: number): number {
    return scrollLeft - leftStickyOffset + location.column.left - 1;
}

export function isRightCellAllVisible(state: State, location: Location, visibleScrollAreaWidth: number) {
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { left } = getReactGridOffsets(state);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);
    return visibleScrollAreaWidth < location.column.right - leftStickyOffset
}

export function isLeftCellAllVisible(state: State, location: Location) {
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { left } = getReactGridOffsets(state);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);
    return location.column.left < leftStickyOffset;
}

export function isFocusLocationOnLeftSticky(state: State, location: Location) {
    const { stickyLeftRange } = state.cellMatrix.ranges;
    const column = location.column;
    return stickyLeftRange.columns.length > 0 && column.idx <= stickyLeftRange.last.column.idx;
}