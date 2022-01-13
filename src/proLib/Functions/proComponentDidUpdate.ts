import { ProState } from "../Model/ProState";
import {
  Location,
  ReactGridProps,
  areLocationsEqual,
  Direction,
  scrollIntoView,
  getScrollOfScrollableElement,
  getVisibleScrollAreaHeight,
  getReactGridOffsets,
  getStickyOffset,
  isFocusLocationOnTopSticky,
  isBottomCellAllVisible,
  getCalculatedScrollTopValueToBottom,
  isTopCellAllVisible,
  getCalculatedScrollTopValueToTop,
  getVisibleScrollAreaWidth,
  isFocusLocationOnLeftSticky,
  isRightCellAllVisible,
  getCalculatedScrollLeftValueToRight,
  isLeftCellAllVisible,
  getCalculatedScrollLeftValueToLeft,
  getTopScrollableElement,
} from "../../core";
import { ResizeColumnBehavior } from "../Behaviors/ResizeColumnBehavior";

//TODO what about initialFocusLocation and focusLocation set by props
export function proComponentDidUpdate(
  prevProps: ReactGridProps,
  prevState: ProState,
  state: ProState
): void {
  const location = state.focusedLocation;
  if (location) {
    const shouldChangeScroll =
      !areLocationsEqual(location, prevState.focusedLocation) &&
      !(state.currentBehavior instanceof ResizeColumnBehavior);
    const wasCellEditorOpened =
      state.currentlyEditedCell !== undefined &&
      state.currentlyEditedCell !== prevState.currentlyEditedCell;
    if (shouldChangeScroll || wasCellEditorOpened) {
      const { left, top } = scrollCalculator(state, location);
      scrollIntoView(state, top, left);
    }
    //TODO Try to change scroll after selected range is changing
    // const activeSelectedRange = getProActiveSelectedRange(prevState);
    // if (activeSelectedRange) {
    //     const shouldChangeScrollForActiveSelectedRangeChange = areRangeIsChanging(state, prevState);
    //     if (shouldChangeScrollForActiveSelectedRangeChange && (state.selectedRanges[0].rows.length !== 1 || state.selectedRanges[0].columns.length !== 1)) {

    //     }
    // }
  }
}

export function scrollCalculator(
  state: ProState,
  location: Location,
  direction: Direction = "both"
): { top: number; left: number } {
  const top = getScrollTop(state, location, direction === "horizontal");
  const left = getScrollLeft(state, location, direction === "vertical");
  return { top, left };
}

export function getScrollTop(
  state: ProState,
  location: Location,
  dontChange: boolean
): number {
  const { stickyTopRange, stickyBottomRange } = state.cellMatrix.ranges;
  const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
  const wholeStickyHeight = stickyTopRange.height + stickyBottomRange.height;
  const visibleScrollAreaHeight = getVisibleScrollAreaHeight(
    state,
    wholeStickyHeight
  );
  const { top } = getReactGridOffsets(state);
  const topStickyOffset = getStickyOffset(scrollTop, top);
  const row = location.row;
  if (dontChange || !row) {
    return scrollTop;
  }
  const additionalPixelOnScrollingOnBody = isLocationOnScrollableBody(
    state,
    location
  )
    ? 1
    : 0;
  if (
    isFocusLocationOnTopSticky(state, location) ||
    isFocusLocationOnBottomSticky(state, location)
  ) {
    return scrollTop;
  } else if (
    isBottomCellAllVisible(
      state,
      location,
      visibleScrollAreaHeight + additionalPixelOnScrollingOnBody
    )
  ) {
    return getCalculatedScrollTopValueToBottom(
      location,
      visibleScrollAreaHeight - 1 - additionalPixelOnScrollingOnBody,
      scrollTop,
      topStickyOffset
    );
  } else if (isTopCellAllVisible(state, location)) {
    return getCalculatedScrollTopValueToTop(
      location,
      scrollTop,
      topStickyOffset
    );
  }
  return scrollTop;
}

export function getScrollLeft(
  state: ProState,
  location: Location,
  dontChange: boolean
): number {
  const { stickyLeftRange, stickyRightRange } = state.cellMatrix.ranges;
  const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
  const wholeStickyWidth = stickyLeftRange.width + stickyRightRange.width;
  const visibleScrollAreaWidth = getVisibleScrollAreaWidth(
    state,
    wholeStickyWidth
  );
  const { left } = getReactGridOffsets(state);
  const leftStickyOffset = getStickyOffset(scrollLeft, left);
  const column = location.column;
  if (dontChange || !column) {
    return scrollLeft;
  }
  const additionalPixelOnScrollingOnBody = isLocationOnScrollableBody(
    state,
    location
  )
    ? 1
    : 0;
  if (
    isFocusLocationOnLeftSticky(state, location) ||
    isFocusLocationOnRightSticky(state, location)
  ) {
    return scrollLeft;
  } else if (
    isRightCellAllVisible(
      state,
      location,
      visibleScrollAreaWidth + additionalPixelOnScrollingOnBody
    )
  ) {
    return getCalculatedScrollLeftValueToRight(
      location,
      visibleScrollAreaWidth - 1 - additionalPixelOnScrollingOnBody,
      scrollLeft,
      leftStickyOffset
    );
  } else if (isLeftCellAllVisible(state, location)) {
    return getCalculatedScrollLeftValueToLeft(
      location,
      scrollLeft,
      leftStickyOffset
    );
  }
  return scrollLeft;
}

function isFocusLocationOnRightSticky(state: ProState, location: Location) {
  const { stickyRightRange } = state.cellMatrix.ranges;
  const column = location.column;
  return (
    stickyRightRange.columns.length > 0 &&
    column.idx >= stickyRightRange.first.column.idx
  );
}

function isFocusLocationOnBottomSticky(state: ProState, location: Location) {
  const { stickyBottomRange } = state.cellMatrix.ranges;
  const row = location.row;
  return (
    stickyBottomRange.rows.length > 0 &&
    row.idx >= stickyBottomRange.first.row.idx
  );
}

function isLocationOnScrollableBody(state: ProState, location: Location) {
  return (
    state.cellMatrix.scrollableRange.contains(location) &&
    state.scrollableElement === getTopScrollableElement()
  );
}
