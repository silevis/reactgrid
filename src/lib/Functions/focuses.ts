import { Location } from '../Model/InternalModel';
import { State } from '../Model/State';
import { focusLocation } from './focusLocation';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { getVisibleScrollAreaHeight, isFocusLocationOnTopSticky } from './scrollIntoView';


export type FocusLocationFn = (state: State, location: Location) => State;
export type FocusCellFn = (colIdx: number, rowIdx: number, state: State) => State;
export type RowCalcFn = (state: State, location: Location) => number;

export const focusCell = withFocusLocation(focusLocation);

export const moveFocusHome = withMoveFocusHome(focusCell);
export const moveFocusEnd = withMoveFocusEnd(focusCell);
export const moveFocusLeft = withMoveFocusLeft(focusCell);
export const moveFocusRight = withMoveFocusRight(focusCell);
export const moveFocusUp = withMoveFocusUp(focusCell);
export const moveFocusDown = withMoveFocusDown(focusCell);
export const moveFocusPage = withMoveFocusPage(focusCell);
export const moveFocusPageUp = moveFocusPage(pageUpRowCalc);
export const moveFocusPageDown = moveFocusPage(pageDownRowCalc);

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

function pageUpRowCalc(state: State, location: Location): number {
    const visibleScrollAreaHeight = getVisibleHeight(state, state.cellMatrix.ranges.stickyTopRange.height);
    const hasTopSticky = state.cellMatrix.ranges.stickyTopRange.rows.length > 0;
    const isOnTopSticky = hasTopSticky && isFocusLocationOnTopSticky(state, location);
    const hasScrollableRange = state.cellMatrix.scrollableRange.rows.length > 0;
    const isOnFirstElementOnScrollableRange = hasScrollableRange && location?.row.idx === state.cellMatrix.scrollableRange.first.row.idx;
    const rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(row => row.bottom < visibleScrollAreaHeight)
    const { stickyTopRange } = state.cellMatrix.ranges;
    let rowIdx = 0;
    if (isOnTopSticky) {
        rowIdx = state.cellMatrix.ranges.stickyTopRange.first.row.idx;
    } else if (isOnFirstElementOnScrollableRange) {
        rowIdx = stickyTopRange.rows.length > 0 ? state.cellMatrix.ranges.stickyTopRange.last.row.idx : state.cellMatrix.first.row.idx;
    } else if (location.row.idx >= rowsOnScreen.length + state.cellMatrix.ranges.stickyTopRange.rows.length) {
        rowIdx = location.row.idx - rowsOnScreen.length > 0 ? location.row.idx - rowsOnScreen.length : 0;
    } else {
        rowIdx = state.cellMatrix.scrollableRange.first.row.idx;
    }
    const nextFocusableLocation = getNextFocusableLocation(state, rowIdx, location.column.idx)
    if (!nextFocusableLocation) {
        const nextLocation = state.cellMatrix.getLocation(rowIdx, location.column.idx);
        const focusLocation = getFocusLocationToDown(state, nextLocation);
        return focusLocation ? focusLocation.row.idx : location.row.idx;
    }
    return rowIdx;
}

function pageDownRowCalc(state: State, location: Location): number {
    const isOnTopSticky = isFocusLocationOnTopSticky(state, location);
    const hasTopSticky = state.cellMatrix.ranges.stickyTopRange.rows.length > 0;
    const isOnLastRowOnTopSticky = hasTopSticky && location?.row.idx === state.cellMatrix.ranges?.stickyTopRange.last.row.idx;
    const hasScrollableRange = state.cellMatrix.scrollableRange.rows.length > 0;
    let rowIdx = 0;
    if (isOnTopSticky) {
        if (isOnTopSticky && !isOnLastRowOnTopSticky) {
            rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx;
        } else {
            rowIdx = hasScrollableRange ? state.cellMatrix.scrollableRange.first.row.idx : state.cellMatrix.ranges.stickyTopRange.last.row.idx;
        }
    } else {
        const visibleScrollAreaHeight = getVisibleHeight(state, state.cellMatrix.ranges.stickyTopRange.height);
        const rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(row => row.top + row.height < visibleScrollAreaHeight)
        rowIdx = location.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
            ? location.row.idx + rowsOnScreen.length
            : state.cellMatrix.rows.length - 1
    }
    const nextFocusableLocation = getNextFocusableLocation(state, rowIdx, location.column.idx)
    if (!nextFocusableLocation) {
        const nextLocation = state.cellMatrix.getLocation(rowIdx, location.column.idx);
        const focusLocation = getFocusLocationToUp(state, nextLocation);
        return focusLocation ? focusLocation.row.idx : location.row.idx;
    }
    return rowIdx;
}