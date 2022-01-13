import { proFocusLocation } from "./proFocusLocation";
import {
  withFocusLocation,
  withMoveFocusLeft,
  withMoveFocusRight,
  withMoveFocusUp,
  withMoveFocusDown,
  isFocusLocationOnTopSticky,
  withMoveFocusPage,
  Location,
  State,
  getVisibleHeight,
  getNextFocusableLocation,
  getFocusLocationToUp,
  getFocusLocationToDown,
  withMoveFocusHome,
  withMoveFocusEnd,
} from "../../core";
import { ProState } from "../Model/ProState";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const proFocusCell = withFocusLocation(proFocusLocation as any);
export type ProFocusCellFn = (
  colIdx: number,
  rowIdx: number,
  state: State
) => State;

export const proMoveFocusHome = withMoveFocusHome(proFocusCell);
export const proMoveFocusEnd = withMoveFocusEnd(proFocusCell);
export const proMoveFocusLeft = withMoveFocusLeft(proFocusCell);
export const proMoveFocusRight = withMoveFocusRight(proFocusCell);
export const proMoveFocusUp = withMoveFocusUp(proFocusCell);
export const proMoveFocusDown = withMoveFocusDown(proFocusCell);

export const moveFocusPage = withMoveFocusPage(proFocusCell);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const proMoveFocusPageUp = moveFocusPage(pageUpRowCalc as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const proMoveFocusPageDown = moveFocusPage(pageDownRowCalc as any);

function pageDownRowCalc(state: ProState, location: Location): number {
  const hasTopSticky = state.cellMatrix.ranges.stickyTopRange.rows.length > 0;
  const isOnTopSticky =
    hasTopSticky && isFocusLocationOnTopSticky(state, location);
  const isOnLastRowOnTopSticky =
    hasTopSticky &&
    location.row.idx === state.cellMatrix.ranges?.stickyTopRange.last.row.idx;
  const hasScrollableRange = state.cellMatrix.scrollableRange.rows.length > 0;
  const isOnScrollableRange =
    hasScrollableRange &&
    location.row.idx >= state.cellMatrix.scrollableRange.first.row.idx &&
    location.row.idx < state.cellMatrix.scrollableRange.last.row.idx;
  const isOnLastRowOfScrollableRange =
    hasScrollableRange &&
    location.row.idx === state.cellMatrix.scrollableRange.last.row.idx;
  const hasBottomSticky =
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0;
  const isOnBottomSticky =
    hasBottomSticky &&
    location.row.idx >= state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
  const visibleScrollAreaHeight = getVisibleHeight(
    state,
    state.cellMatrix.ranges.stickyTopRange.height +
      state.cellMatrix.ranges.stickyBottomRange.height
  );
  const rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(
    (row) => row.top + row.height < visibleScrollAreaHeight
  );
  let rowIdx = 0;
  if (isOnTopSticky) {
    if (isOnTopSticky && !isOnLastRowOnTopSticky) {
      rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx;
    } else if (hasScrollableRange) {
      rowIdx = state.cellMatrix.scrollableRange.first.row.idx;
    } else if (hasBottomSticky) {
      rowIdx = state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
    } else {
      rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx;
    }
  } else if (isOnScrollableRange) {
    rowIdx =
      location.row.idx + rowsOnScreen.length <
      state.cellMatrix.scrollableRange.rows.length
        ? location.row.idx + rowsOnScreen.length
        : state.cellMatrix.scrollableRange.last.row.idx;
  } else if (isOnLastRowOfScrollableRange) {
    hasBottomSticky
      ? (rowIdx = state.cellMatrix.ranges.stickyBottomRange.first.row.idx)
      : (rowIdx = state.cellMatrix.scrollableRange.last.row.idx);
  } else if (isOnBottomSticky) {
    rowIdx = state.cellMatrix.ranges.stickyBottomRange.last.row.idx;
  }
  const nextFocusableLocation = getNextFocusableLocation(
    state,
    rowIdx,
    location.column.idx
  );
  if (!nextFocusableLocation) {
    const nextLocation = state.cellMatrix.getLocation(
      rowIdx,
      location.column.idx
    );
    const focusLocation = getFocusLocationToUp(state, nextLocation);
    return focusLocation ? focusLocation.row.idx : location.row.idx;
  }
  return rowIdx;
}

function pageUpRowCalc(state: ProState, location: Location): number {
  const visibleScrollAreaHeight = getVisibleHeight(
    state,
    state.cellMatrix.ranges.stickyTopRange.height +
      state.cellMatrix.ranges.stickyBottomRange.height
  );
  const hasTopSticky = state.cellMatrix.ranges.stickyTopRange.rows.length > 0;
  const isOnTopSticky =
    hasTopSticky && isFocusLocationOnTopSticky(state, location);
  const hasScrollableRange = state.cellMatrix.scrollableRange.rows.length > 0;
  const isOnScrollableRange =
    hasScrollableRange &&
    location.row.idx > state.cellMatrix.scrollableRange.first.row.idx &&
    location.row.idx <= state.cellMatrix.scrollableRange.last.row.idx;
  const isOnFirstElementOnScrollableRange =
    hasScrollableRange &&
    location.row.idx === state.cellMatrix.scrollableRange.first.row.idx;
  const hasBottomSticky =
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0;
  const isOnBottomSticky =
    hasBottomSticky &&
    location.row.idx >= state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
  const isOnFirstRowOnBottomSticky =
    hasBottomSticky &&
    location?.row.idx ===
      state.cellMatrix.ranges?.stickyBottomRange.first.row.idx;

  const rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(
    (row) => row.top + row.height < visibleScrollAreaHeight
  );
  let rowIdx = 0;

  if (isOnBottomSticky) {
    if (isOnBottomSticky && !isOnFirstRowOnBottomSticky) {
      rowIdx = state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
    } else if (hasScrollableRange) {
      rowIdx = state.cellMatrix.scrollableRange.last.row.idx;
    } else if (hasTopSticky) {
      rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx;
    } else {
      rowIdx = state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
    }
  } else if (isOnScrollableRange) {
    rowIdx =
      location.row.idx - rowsOnScreen.length <
      state.cellMatrix.scrollableRange.first.row.idx
        ? state.cellMatrix.scrollableRange.first.row.idx
        : location.row.idx - rowsOnScreen.length;
  } else if (isOnFirstElementOnScrollableRange) {
    hasTopSticky
      ? (rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx)
      : (rowIdx = state.cellMatrix.scrollableRange.first.row.idx);
  } else if (isOnTopSticky) {
    rowIdx = state.cellMatrix.ranges.stickyTopRange.first.row.idx;
  }
  const nextFocusableLocation = getNextFocusableLocation(
    state,
    rowIdx,
    location.column.idx
  );
  if (!nextFocusableLocation) {
    const nextLocation = state.cellMatrix.getLocation(
      rowIdx,
      location.column.idx
    );
    const focusLocation = getFocusLocationToDown(state, nextLocation);
    return focusLocation ? focusLocation.row.idx : location.row.idx;
  }
  return rowIdx;
}
