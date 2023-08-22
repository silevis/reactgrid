import { keyCodes } from "../../lib";
import {
  handleKeyDownOnCellTemplate,
  areLocationsEqual,
  isMacOs,
  isSelectionKey,
  Range,
  Location,
  scrollIntoView,
  getVisibleScrollAreaHeight,
} from "../../core";
import { KeyboardEvent } from "../Model/domEventsTypes";
import { getActiveSelectedRange } from "./getActiveSelectedRange";
import { State } from "../Model/State";
import { focusLocation } from "./focusLocation";
import { wipeSelectedRanges } from "./wipeSelectedRanges";
import {
  moveFocusLeft,
  moveFocusUp,
  moveFocusDown,
  moveFocusRight,
  moveFocusPageDown,
  moveFocusPageUp,
  moveFocusHome,
  moveFocusEnd,
} from "./focuses";
import { scrollCalculator } from "./componentDidUpdate";
import { resetSelection } from "./selectRange";
import { newLocation } from "./newLocation";

export function handleKeyDown(state: State, event: KeyboardEvent): State {
  const newState = handleKeyDownInternal(state, event);
  if (newState !== state) {
    event.stopPropagation();
    event.preventDefault();
  }
  return newState;
}

// TODO: rewrite/simplify if possible
function handleKeyDownInternal(
  state: State,
  event: KeyboardEvent
): State {
  const location = state.focusedLocation;
  if (!location) {
    return state;
  }

  const asr = getActiveSelectedRange(state);

  if (event.ctrlKey && isMacOs()) {
    switch (event.keyCode) {
      case keyCodes.SPACE:
        return resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx,
          0,
          state.cellMatrix.last.row.idx
        );
    }
  }

  const isSingleCellSelected =
    state.selectedRanges.length === 1 && areLocationsEqual(asr.first, asr.last);
  const newState = handleKeyDownOnCellTemplate(state, event) as State;
  if (newState !== state) {
    if (!isSingleCellSelected && event.keyCode === keyCodes.ENTER) {
      const direction = event.shiftKey
        ? "up"
        : state.props?.moveRightOnEnter
        ? "right"
        : "down";
      state.hiddenFocusElement?.focus();
      return moveFocusInsideSelectedRange(
        state,
        direction,
        asr,
        location
      ) as State;
    }
    return newState;
  }

  if (event.altKey) return state;

  if (isSelectionKey(event) && event.shiftKey) {
    switch (event.keyCode) {
      case keyCodes.HOME:
        return resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx,
          0,
          asr.last.row.idx
        );
      case keyCodes.END:
        return resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx,
          asr.first.row.idx,
          state.cellMatrix.last.row.idx
        );
    }
  } else if (isSelectionKey(event)) {
    const cm = state.cellMatrix;
    switch (event.keyCode) {
      case keyCodes.KEY_A: {
        if (
          state.selectedRanges.length === 1 &&
          areLocationsEqual(state.selectedRanges[0].first, cm.first) &&
          areLocationsEqual(state.selectedRanges[0].last, cm.last)
        ) {
          return resetSelection(state, location);
        }

        const newRange = cm.getRange(cm.first, cm.last);

        if (state.props?.onSelectionChanging && !state.props.onSelectionChanging([newRange])) {  
          return state;
        }

        return {
          ...state,
          selectedRanges: [newRange],
          selectionMode: "range",
          activeSelectedRangeIdx: 0,
        };
      }
      case keyCodes.HOME:
        return focusLocation(state, state.cellMatrix.first);
      case keyCodes.END:
        return focusLocation(state, state.cellMatrix.last);
      case keyCodes.SPACE:
        return resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx,
          0,
          state.cellMatrix.last.row.idx
        );
    }
  } else if (event.shiftKey) {
    switch (event.keyCode) {
      case keyCodes.UP_ARROW:
        return resizeSelectionUp(state, asr, location);
      case keyCodes.DOWN_ARROW:
        return resizeSelectionDown(state, asr, location);
      case keyCodes.LEFT_ARROW:
        return resizeSelectionLeft(state, asr, location);
      case keyCodes.RIGHT_ARROW:
        return resizeSelectionRight(state, asr, location);
      case keyCodes.TAB:
        event.preventDefault(); // prevent from leaving HFE
        return (
          isSingleCellSelected
            ? moveFocusLeft(state)
            : moveFocusInsideSelectedRange(state, "left", asr, location)
        ) as State;
      case keyCodes.ENTER:
        state.hiddenFocusElement?.focus();
        return (
          isSingleCellSelected
            ? moveFocusUp(state)
            : moveFocusInsideSelectedRange(state, "up", asr, location)
        ) as State;
      case keyCodes.SPACE:
        return resizeSelection(
          state,
          0,
          state.cellMatrix.last.column.idx,
          asr.first.row.idx,
          asr.last.row.idx
        );
      case keyCodes.HOME:
        return resizeSelection(
          state,
          0,
          asr.last.column.idx,
          asr.first.row.idx,
          asr.last.row.idx
        );
      case keyCodes.END:
        return resizeSelection(
          state,
          asr.first.column.idx,
          state.cellMatrix.last.column.idx,
          asr.first.row.idx,
          asr.last.row.idx
        );
      case keyCodes.PAGE_UP:
        return resizeSelectionPageUp(state, asr, location);
      case keyCodes.PAGE_DOWN:
        return resizeSelectionPageDown(state, asr, location);
    }
  } else {
    // === NO SHIFT OR CONTROL ===
    switch (event.keyCode) {
      case keyCodes.DELETE:
      case keyCodes.BACKSPACE:
        state.hiddenFocusElement?.focus();
        return wipeSelectedRanges(state) as State;
      case keyCodes.UP_ARROW:
        state.hiddenFocusElement?.focus();
        return moveFocusUp(state) as State;
      case keyCodes.DOWN_ARROW:
        state.hiddenFocusElement?.focus();
        return moveFocusDown(state) as State;
      case keyCodes.LEFT_ARROW:
        state.hiddenFocusElement?.focus();
        return moveFocusLeft(state) as State;
      case keyCodes.RIGHT_ARROW:
        state.hiddenFocusElement?.focus();
        return moveFocusRight(state) as State;
      case keyCodes.TAB:
        state.hiddenFocusElement?.focus();
        event.preventDefault(); // prevent from leaving HFE
        return (
          isSingleCellSelected
            ? moveFocusRight(state)
            : moveFocusInsideSelectedRange(state, "right", asr, location)
        ) as State;
      case keyCodes.HOME:
        state.hiddenFocusElement?.focus();
        return moveFocusHome(state) as State;
      case keyCodes.END:
        state.hiddenFocusElement?.focus();
        return moveFocusEnd(state) as State;
      case keyCodes.PAGE_UP:
        state.hiddenFocusElement?.focus();
        return moveFocusPageUp(state) as State;
      case keyCodes.PAGE_DOWN:
        state.hiddenFocusElement?.focus();
        return moveFocusPageDown(state) as State;
      case keyCodes.ENTER: {
        const isMoveRightEnable = state.props?.moveRightOnEnter
          ? { ...moveFocusRight(state), currentlyEditedCell: undefined }
          : { ...moveFocusDown(state), currentlyEditedCell: undefined };
        state.hiddenFocusElement?.focus();
        return (
          isSingleCellSelected
            ? isMoveRightEnable
            : moveFocusInsideSelectedRange(state, "right", asr, location)
        ) as State;
      }
      case keyCodes.ESCAPE:
        event.preventDefault();
        state.hiddenFocusElement?.focus();
        return state.currentlyEditedCell
          ? { ...state, currentlyEditedCell: undefined }
          : state;
    }
  }

  return state;
}

function moveFocusInsideSelectedRange(
  state: State,
  direction: "left" | "right" | "up" | "down",
  asr: Range,
  location: Location
): State {
  const selectedRangeIdx = state.activeSelectedRangeIdx;
  const colCount = asr ? asr.columns.length : 0;
  const rowCount = asr ? asr.rows.length : 0;
  const delta = direction === "up" || direction === "left" ? -1 : 1;

  const currentPosInRange =
    direction === "up" || direction === "down"
      ? location.row.idx -
        asr.first.row.idx +
        (location.column.idx - asr.first.column.idx) * rowCount
      : (location.row.idx - asr.first.row.idx) * colCount +
        (location.column.idx - asr.first.column.idx);

  const newPosInRange =
    (currentPosInRange + delta) % (asr.rows.length * asr.columns.length);

  const onShiftAndTabKeys =
    (newPosInRange < 0 && currentPosInRange === 0) ||
    (rowCount === 1 && colCount === 1 && delta === -1);
  const onTabKey =
    (newPosInRange === 0 &&
      currentPosInRange === asr.rows.length * asr.columns.length - 1 &&
      ((rowCount >= 3 && colCount >= 1) || (rowCount >= 1 && colCount >= 3))) ||
    (newPosInRange === 0 &&
      currentPosInRange === asr.rows.length * asr.columns.length - 1 &&
      ((rowCount === 2 && colCount >= 1) ||
        (rowCount >= 1 && colCount === 2)) &&
      delta === 1) ||
    (newPosInRange < 0 && currentPosInRange === 0) ||
    (rowCount === 1 && colCount === 1 && delta === 1); // must be so complicated

  if (onShiftAndTabKeys) {
    // shift + tab/enter and first cell focused in active range
    const nextSelectionRangeIdx =
      selectedRangeIdx === 0
        ? state.selectedRanges.length - 1
        : (selectedRangeIdx - 1) % state.selectedRanges.length;
    const nextSelection = state.selectedRanges[nextSelectionRangeIdx];
    state = focusLocation(
      state,
      newLocation(nextSelection.last.row, nextSelection.last.column),
      false
    );
    return { ...state, activeSelectedRangeIdx: nextSelectionRangeIdx };
  } else if (onTabKey) {
    // tab/enter and last cell focused in active range
    const nextSelectionRangeIdx =
      (selectedRangeIdx + 1) % state.selectedRanges.length;
    const nextSelection = state.selectedRanges[nextSelectionRangeIdx];
    state = focusLocation(
      state,
      newLocation(nextSelection.first.row, nextSelection.first.column),
      false
    );
    return { ...state, activeSelectedRangeIdx: nextSelectionRangeIdx };
  } else {
    // tab/enter and all cells inside active range except last cell && shift + tab/enter and all cells inside active range except first cell
    const focusedCellColIdxInRange =
      direction === "up" || direction === "down"
        ? Math.floor(newPosInRange / rowCount)
        : newPosInRange % colCount;
    const focusedCellRowIdxInRange =
      direction === "up" || direction === "down"
        ? newPosInRange % rowCount
        : Math.floor(newPosInRange / colCount);
    const focusedCellColIdx = asr.first.column.idx + focusedCellColIdxInRange;
    const focusedCellRowIdx = asr.first.row.idx + focusedCellRowIdxInRange;
    state = focusLocation(
      state,
      state.cellMatrix.getLocation(focusedCellRowIdx, focusedCellColIdx),
      asr
        ? asr.columns.length > 1 || asr.rows.length > 1
          ? false
          : true
        : true
    );
    return state;
  }
}

function getVisibleHeight(state: State): number {
  const { stickyBottomRange, stickyTopRange } = state.cellMatrix.ranges;
  const wholeStickyHeight = stickyBottomRange.height + stickyTopRange.height;
  const visibleScrollAreaHeight = getVisibleScrollAreaHeight(
    state,
    wholeStickyHeight
  );
  return visibleScrollAreaHeight;
}

function resizeSelectionPageDown(
  state: State,
  asr: Range,
  location: Location
): State {
  const visibleScrollAreaHeight = getVisibleHeight(state);

  const isLastRowOnTopSticky =
    state.cellMatrix.ranges.stickyTopRange.rows.length > 0 &&
    asr.last.row.idx < state.cellMatrix.ranges.stickyTopRange.last.row.idx;
  const isFirstRowOnTopSticky =
    state.cellMatrix.ranges.stickyTopRange.rows.length > 0 &&
    asr.first.row.idx < state.cellMatrix.ranges.stickyTopRange.last.row.idx;
  const isOnLastRowOnTopSticky =
    state.cellMatrix.ranges.stickyTopRange.rows.length > 0 &&
    asr.last.row.idx === state.cellMatrix.ranges.stickyTopRange.last.row.idx;
  const isOnFirstRowOnTopSticky =
    state.cellMatrix.ranges.stickyTopRange.rows.length > 0 &&
    asr.first.row.idx === state.cellMatrix.ranges.stickyTopRange.last.row.idx;
  const isOnLastRowOnScrollableRange =
    state.cellMatrix.scrollableRange.rows.length > 0 &&
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
    asr.last.row.idx === state.cellMatrix.scrollableRange.last.row.idx;
  const isOnFirstRowOnScrollableRange =
    state.cellMatrix.scrollableRange.rows.length > 0 &&
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
    asr.first.row.idx === state.cellMatrix.scrollableRange.last.row.idx;
  const isLastRowOnBottomSticky =
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
    asr.last.row.idx >= state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
  const isFirstRowOnBottomSticky =
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
    asr.first.row.idx >=
      state.cellMatrix.ranges.stickyBottomRange.first.row.idx;

  const rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(
    (row) => row.top + row.height < visibleScrollAreaHeight
  );
  return asr.last.row.idx <= state.cellMatrix.last.row.idx
    ? asr.first.row.idx < location.row.idx
      ? resizeSelection(
          state,
          asr.last.column.idx,
          asr.first.column.idx,
          asr.last.row.idx,
          isFirstRowOnTopSticky
            ? state.cellMatrix.ranges.stickyTopRange.last.row.idx
            : isOnFirstRowOnTopSticky
            ? state.cellMatrix.scrollableRange.rows.length > 0
              ? state.cellMatrix.scrollableRange.first.row.idx
              : state.cellMatrix.ranges.stickyBottomRange.first.row.idx
            : isOnFirstRowOnScrollableRange
            ? state.cellMatrix.ranges.stickyBottomRange.first.row.idx
            : isFirstRowOnBottomSticky
            ? state.cellMatrix.ranges.stickyBottomRange.last.row.idx
            : asr.first.row.idx + rowsOnScreen.length >=
              state.cellMatrix.scrollableRange.last.row.idx
            ? state.cellMatrix.scrollableRange.last.row.idx
            : asr.first.row.idx + rowsOnScreen.length,
          "vertical"
        )
      : resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx,
          asr.first.row.idx,
          isLastRowOnBottomSticky
            ? state.cellMatrix.ranges.stickyBottomRange.last.row.idx
            : isOnLastRowOnTopSticky
            ? state.cellMatrix.scrollableRange.rows.length > 0
              ? state.cellMatrix.scrollableRange.first.row.idx
              : state.cellMatrix.ranges.stickyBottomRange.rows.length > 0
              ? state.cellMatrix.ranges.stickyBottomRange.first.row.idx
              : state.cellMatrix.ranges.stickyTopRange.last.row.idx
            : isOnLastRowOnScrollableRange
            ? state.cellMatrix.ranges.stickyBottomRange.first.row.idx
            : isLastRowOnTopSticky
            ? state.cellMatrix.ranges.stickyTopRange.last.row.idx
            : asr.last.row.idx + rowsOnScreen.length >=
              state.cellMatrix.scrollableRange.last.row.idx
            ? state.cellMatrix.scrollableRange.last.row.idx
            : asr.last.row.idx + rowsOnScreen.length,
          "vertical"
        )
    : state;
}

function resizeSelectionPageUp(
  state: State,
  asr: Range,
  location: Location
): State {
  const visibleScrollAreaHeight = getVisibleHeight(state);

  const isFirstRowOnBottomSticky =
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
    asr.first.row.idx > state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
  const isLastRowOnBottomSticky =
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
    asr.last.row.idx === state.cellMatrix.ranges.stickyBottomRange.last.row.idx;
  const isOnLastRowOnBottomSticky =
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
    asr.last.row.idx ===
      state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
  const isOnFirstRowOnBottomSticky =
    state.cellMatrix.ranges.stickyBottomRange.rows.length > 0 &&
    asr.first.row.idx ===
      state.cellMatrix.ranges.stickyBottomRange.first.row.idx;
  const isOnLastRowOnTopSticky =
    state.cellMatrix.ranges.stickyTopRange.rows.length > 0 &&
    asr.last.row.idx === state.cellMatrix.ranges.stickyTopRange.last.row.idx;
  const isOnFirstRowOnScrollableRange =
    state.cellMatrix.scrollableRange.rows.length > 0 &&
    state.cellMatrix.ranges.stickyTopRange.rows.length > 0 &&
    asr.first.row.idx === state.cellMatrix.scrollableRange.first.row.idx;
  const isOnLastRowOnScrollableRange =
    state.cellMatrix.scrollableRange.rows.length > 0 &&
    state.cellMatrix.ranges.stickyTopRange.rows.length > 0 &&
    asr.last.row.idx === state.cellMatrix.scrollableRange.first.row.idx;
  const isOnTopSticky =
    state.cellMatrix.ranges.stickyTopRange.rows.length > 0 &&
    asr.first.row.idx <= state.cellMatrix.ranges.stickyTopRange.last.row.idx;

  const rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(
    (row) => row.top + row.height < visibleScrollAreaHeight
  );

  return asr.first.row.idx >= 0
    ? asr.last.row.idx > location.row.idx
      ? resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx,
          asr.first.row.idx,
          isLastRowOnBottomSticky
            ? state.cellMatrix.ranges.stickyBottomRange.first.row.idx
            : isOnLastRowOnBottomSticky
            ? state.cellMatrix.scrollableRange.rows.length > 0
              ? state.cellMatrix.scrollableRange.last.row.idx
              : state.cellMatrix.ranges.stickyTopRange.first.row.idx
            : isOnLastRowOnScrollableRange
            ? state.cellMatrix.ranges.stickyTopRange.last.row.idx
            : isOnLastRowOnTopSticky
            ? state.cellMatrix.ranges.stickyTopRange.first.row.idx
            : asr.last.row.idx - rowsOnScreen.length >
              state.cellMatrix.scrollableRange.first.row.idx
            ? asr.last.row.idx - rowsOnScreen.length
            : state.cellMatrix.scrollableRange.first.row.idx,
          "vertical"
        )
      : resizeSelection(
          state,
          asr.last.column.idx,
          asr.first.column.idx,
          asr.last.row.idx,
          isFirstRowOnBottomSticky
            ? state.cellMatrix.ranges.stickyBottomRange.first.row.idx
            : isOnFirstRowOnBottomSticky
            ? state.cellMatrix.scrollableRange.rows.length > 0
              ? state.cellMatrix.scrollableRange.last.row.idx
              : state.cellMatrix.ranges.stickyTopRange.rows.length > 0
              ? state.cellMatrix.ranges.stickyTopRange.first.row.idx
              : state.cellMatrix.ranges.stickyBottomRange.first.row.idx
            : isOnFirstRowOnScrollableRange
            ? state.cellMatrix.ranges.stickyTopRange.last.row.idx
            : isOnTopSticky
            ? state.cellMatrix.ranges.stickyTopRange.first.row.idx
            : isFirstRowOnBottomSticky
            ? state.cellMatrix.ranges.stickyBottomRange.first.row.idx
            : asr.first.row.idx - rowsOnScreen.length >
              state.cellMatrix.scrollableRange.first.row.idx
            ? asr.first.row.idx - rowsOnScreen.length
            : state.cellMatrix.scrollableRange.first.row.idx,
          "vertical"
        )
    : state;
}

function resizeSelectionUp(
  state: State,
  asr: Range,
  location: Location
): State {
  return asr.first.row.idx >= 0
    ? asr.last.row.idx > location.row.idx
      ? resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx,
          asr.first.row.idx,
          asr.last.row.idx > 0 ? asr.last.row.idx - 1 : 0,
          "vertical"
        )
      : resizeSelection(
          state,
          asr.last.column.idx,
          asr.first.column.idx,
          asr.last.row.idx,
          asr.first.row.idx > 0 ? asr.first.row.idx - 1 : 0,
          "vertical"
        )
    : state;
}

function resizeSelectionDown(
  state: State,
  asr: Range,
  location: Location
): State {
  return asr.last.row.idx <= state.cellMatrix.last.row.idx
    ? asr.first.row.idx < location.row.idx
      ? resizeSelection(
          state,
          asr.last.column.idx,
          asr.first.column.idx,
          asr.last.row.idx,
          asr.first.row.idx >= state.cellMatrix.last.row.idx
            ? state.cellMatrix.last.row.idx
            : asr.first.row.idx + 1,
          "vertical"
        )
      : resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx,
          asr.first.row.idx,
          asr.last.row.idx >= state.cellMatrix.last.row.idx
            ? state.cellMatrix.last.row.idx
            : asr.last.row.idx + 1,
          "vertical"
        )
    : state;
}

function resizeSelectionLeft(
  state: State,
  asr: Range,
  location: Location
): State {
  return asr.first.column.idx >= 0
    ? asr.last.column.idx > location.column.idx
      ? resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx > 0 ? asr.last.column.idx - 1 : 0,
          asr.first.row.idx,
          asr.last.row.idx,
          "horizontal"
        )
      : resizeSelection(
          state,
          asr.last.column.idx,
          asr.first.column.idx > 0 ? asr.first.column.idx - 1 : 0,
          asr.last.row.idx,
          asr.first.row.idx,
          "horizontal"
        )
    : state;
}

function resizeSelectionRight(
  state: State,
  asr: Range,
  location: Location
): State {
  return asr.last.column.idx <= state.cellMatrix.last.column.idx
    ? asr.first.column.idx < location.column.idx
      ? resizeSelection(
          state,
          asr.last.column.idx,
          asr.first.column.idx >= state.cellMatrix.last.column.idx
            ? state.cellMatrix.last.column.idx
            : asr.first.column.idx + 1,
          asr.last.row.idx,
          asr.first.row.idx,
          "horizontal"
        )
      : resizeSelection(
          state,
          asr.first.column.idx,
          asr.last.column.idx >= state.cellMatrix.last.column.idx
            ? state.cellMatrix.last.column.idx
            : asr.last.column.idx + 1,
          asr.first.row.idx,
          asr.last.row.idx,
          "horizontal"
        )
    : state;
}

function resizeSelection(
  state: State,
  firstColIdx: number,
  lastColIdx: number,
  firstRowIdx: number,
  lastRowIdx: number,
  scrollDirection?: "vertical" | "horizontal"
): State {
  if (!state.enableRangeSelection) return state;
  const start = state.cellMatrix.getLocation(firstRowIdx, firstColIdx);
  const end = state.cellMatrix.getLocation(lastRowIdx, lastColIdx);
  const selectedRanges = state.selectedRanges.slice();
  selectedRanges[state.activeSelectedRangeIdx] = state.cellMatrix.getRange(
    start,
    end
  );
  if (scrollDirection) {
    const location = state.focusedLocation;
    if (!location) {
      return state;
    }
    let scrollToRowIdx = 0,
      scrollToColIdx = 0;
    let axis: "vertical" | "horizontal";
    switch (scrollDirection) {
      case "horizontal":
        scrollToRowIdx = location.row.idx;
        scrollToColIdx =
          location.column.idx !== firstColIdx ? firstColIdx : lastColIdx;
        break;
      case "vertical":
        scrollToRowIdx =
          location.row.idx !== firstRowIdx ? firstRowIdx : lastRowIdx;
        scrollToColIdx = location.column.idx;
        break;
      default:
        break;
    }
    const { left, top } = scrollCalculator(
      state,
      state.cellMatrix.getLocation(scrollToRowIdx, scrollToColIdx),
      scrollDirection
    );
    scrollIntoView(state, top, left);
  }

  if (state.props?.onSelectionChanging && !state.props.onSelectionChanging(selectedRanges)) {
    // If selection change is canceled we can just return the state here
    // TODO: We could try to find the "best possible selection", but I've not yet found a use case for this and - as I discovered - it isn't trivial
    // TODO: Also, we could add a external way to change the selection so the users could implement this themselves
    return state;
  }

  state.props?.onSelectionChanged?.(selectedRanges);

  return { ...state, selectedRanges };
}
