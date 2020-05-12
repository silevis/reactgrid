export function shouldRenderTopSticky(state) {
    return state.cellMatrix.ranges.stickyTopRange.height > 0;
}
export function shouldRenderLeftSticky(state) {
    return state.cellMatrix.ranges.stickyLeftRange.width > 0;
}
export function shouldRenderCenterRange(state) {
    return !!(state.visibleRange && state.visibleRange.width > 0);
}
export function shouldRenderMiddleRange(state) {
    return !!(state.cellMatrix.scrollableRange.height > 0 && state.cellMatrix.scrollableRange.first.column &&
        state.cellMatrix.scrollableRange.first.row && state.cellMatrix.scrollableRange.last.row &&
        state.visibleRange && state.visibleRange.height > 0);
}
