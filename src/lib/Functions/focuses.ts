import { Location } from '../Model/InternalModel';
import { State } from '../Model/State';
import { focusLocation } from './focusLocation';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { getVisibleScrollAreaHeight, isFocusLocationOnTopSticky } from './scrollIntoView';

// TODO: rewrite and simplify if possible
export type FocusLocationFn = (state: State, location: Location) => State;
export type FocusCellFn = (colIdx: number, rowIdx: number, state: State) => State;
export type RowCalcFn = (state: State, location: Location) => number;

export const focusCell = withFocusLocation(focusLocation as any);
export type ProFocusCellFn = (
  colIdx: number,
  rowIdx: number,
  state: State
) => State;

export const moveFocusHome = withMoveFocusHome(focusCell);
export const moveFocusEnd = withMoveFocusEnd(focusCell);
export const moveFocusLeft = withMoveFocusLeft(focusCell);
export const moveFocusRight = withMoveFocusRight(focusCell);
export const moveFocusUp = withMoveFocusUp(focusCell);
export const moveFocusDown = withMoveFocusDown(focusCell);

export const moveFocusPage = withMoveFocusPage(focusCell);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const moveFocusPageUp = moveFocusPage(pageUpRowCalc as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const moveFocusPageDown = moveFocusPage(pageDownRowCalc as any);


export function withFocusLocation(focusLocation: FocusLocationFn) {
    return (colIdx: number, rowIdx: number, state: State): State => {
        return focusLocation(state, state.cellMatrix.getLocation(rowIdx, colIdx));
    }
}

export function withMoveFocusEnd(fc: FocusCellFn) {
    return (state: State): State => {
        if (state.focusedLocation) {
            const nextFocusableLocation = getNextFocusableLocation(state, state.focusedLocation.row.idx, state.cellMatrix.columns.length - 1)
            if (!nextFocusableLocation) {
                const nextLocation = state.cellMatrix.getLocation(state.focusedLocation.row.idx, state.cellMatrix.columns.length - 1);
                const focusLocation = getFocusLocationToLeft(state, nextLocation);
                return focusLocation ? fc(focusLocation.column.idx, focusLocation.row.idx, state) : state;
            }
            return fc(nextFocusableLocation.column.idx, nextFocusableLocation.row.idx, state);
        }
        return state;
    }
}

export function withMoveFocusHome(fc: FocusCellFn) {
    return (state: State): State => {
        if (state.focusedLocation) {
            const nextFocusableLocation = getNextFocusableLocation(state, state.focusedLocation.row.idx, 0)
            if (!nextFocusableLocation) {
                const nextLocation = state.cellMatrix.getLocation(state.focusedLocation.row.idx, 0);
                const focusLocation = getFocusLocationToRight(state, nextLocation);
                return focusLocation ? fc(focusLocation.column.idx, focusLocation.row.idx, state) : state;
            }
            return fc(nextFocusableLocation.column.idx, nextFocusableLocation.row.idx, state);
        }
        return state;
    }
}
export function withMoveFocusLeft(fc: FocusCellFn) {
    return (state: State): State => {
        const focusLocation = getFocusLocationToLeft(state, state.focusedLocation);
        return (focusLocation) ? fc(focusLocation.column.idx, focusLocation.row.idx, state) : state;
    }
}

export function getNextFocusableLocation(state: State, rowIdx: number, colIdx: number): Location | undefined {
    const location = state.cellMatrix.getLocation(rowIdx, colIdx);
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    if (!state.props) {
        throw new Error(`"props" field on "state" object should be initiated before possible location focus`);
    }
    const { onFocusLocationChanging } = state.props;
    const cellLocation = { rowId: location.row.rowId, columnId: location.column.columnId };
    const wasChangePrevented = !onFocusLocationChanging || onFocusLocationChanging(cellLocation);
    const isFocusable = (!cellTemplate.isFocusable || cellTemplate.isFocusable(cell)) && wasChangePrevented;
    return isFocusable ? location : undefined;
}

export function getFocusLocationToLeft(state: State, location: Location | undefined): Location | undefined {
    if (location) {
        for (let colIdx = location.column.idx - 1; colIdx >= state.cellMatrix.first.column.idx; --colIdx) {
            const nextFocusableLocation = getNextFocusableLocation(state, location.row.idx, colIdx)
            if (nextFocusableLocation) {
                return nextFocusableLocation;
            }
        }
    }
    return undefined;
}

export function withMoveFocusRight(fc: FocusCellFn) {
    return (state: State): State => {
        const focusLocation = getFocusLocationToRight(state, state.focusedLocation);
        return (focusLocation) ? fc(focusLocation.column.idx, focusLocation.row.idx, state) : state;
    }
}

export function getFocusLocationToRight(state: State, location: Location | undefined): Location | undefined {
    if (location) {
        for (let colIdx = location.column.idx + 1; colIdx <= state.cellMatrix.last.column.idx; ++colIdx) {
            const nextFocusableLocation = getNextFocusableLocation(state, location.row.idx, colIdx)
            if (nextFocusableLocation) {
                return nextFocusableLocation;
            }
        }
    }
    return undefined;
}

export function withMoveFocusUp(fc: FocusCellFn) {
    return (state: State): State => {
        const focusLocation = getFocusLocationToUp(state, state.focusedLocation);
        return (focusLocation) ? fc(focusLocation.column.idx, focusLocation.row.idx, state) : state;
    }
}

export function getFocusLocationToUp(state: State, location: Location | undefined): Location | undefined {
    if (location) {
        for (let rowIdx = location.row.idx - 1; rowIdx >= state.cellMatrix.first.row.idx; --rowIdx) {
            const nextFocusableLocation = getNextFocusableLocation(state, rowIdx, location.column.idx)
            if (nextFocusableLocation) {
                return nextFocusableLocation;
            }
        }
    }
    return undefined;
}

export function withMoveFocusDown(fc: FocusCellFn) {
    return (state: State): State => {
        const focusLocation = getFocusLocationToDown(state, state.focusedLocation);
        return focusLocation ? fc(focusLocation.column.idx, focusLocation.row.idx, state) : state;
    }
}

export function getFocusLocationToDown(state: State, location: Location | undefined): Location | undefined {
    if (location) {
        for (let rowIdx = location.row.idx + 1; rowIdx <= state.cellMatrix.last.row.idx; ++rowIdx) {
            const nextFocusableLocation = getNextFocusableLocation(state, rowIdx, location.column.idx)
            if (nextFocusableLocation) {
                return nextFocusableLocation;
            }
        }
    }
    return undefined;
}

export function withMoveFocusPage(fc: FocusCellFn) {
    return (rowCalculator: RowCalcFn) => {
        return (state: State): State => {
            const location = state.focusedLocation;
            if (!location)
                return state;
            const rowIdx = rowCalculator(state, location);
            return fc(location.column.idx, rowIdx, state);
        }
    }
}

export function getVisibleHeight(state: State, stickyHeight: number): number {
    return getVisibleScrollAreaHeight(state, stickyHeight);
}



function pageDownRowCalc(state: State, location: Location): number {
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

function pageUpRowCalc(state: State, location: Location): number {
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
