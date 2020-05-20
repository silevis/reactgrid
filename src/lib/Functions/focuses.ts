import { State, Location } from "../Model";
import { focusLocation } from "./focusLocation";
import { getVisibleScrollAreaHeight, isFocusLocationOnTopSticky } from ".";


export type FocusLocationFn = (state: State, location: Location) => State;
export type FocusCellFn = (colIdx: number, rowIdx: number, state: State) => State;

export const focusCell = withFocusLocation(focusLocation);

export const moveFocusLeft = withMoveFocusLeft(focusCell);
export const moveFocusRight = withMoveFocusRight(focusCell);
export const moveFocusUp = withMoveFocusUp(focusCell);
export const moveFocusDown = withMoveFocusDown(focusCell);
export const moveFocusPageUp = withMoveFocusPageUp(focusCell);
export const moveFocusPageDown = withMoveFocusPageDown(focusCell);

export function withFocusLocation(focusLocation: FocusLocationFn) {
    return (colIdx: number, rowIdx: number, state: State): State => {
        return focusLocation(state, state.cellMatrix.getLocation(rowIdx, colIdx));
    }
}

export function withMoveFocusLeft(fc: FocusCellFn) {
    return (state: State): State => (state.focusedLocation && state.focusedLocation.column.idx > 0) ?
        fc(state.focusedLocation.column.idx - 1, state.focusedLocation.row.idx, state) : state;
}

export function withMoveFocusRight(fc: FocusCellFn) {
    return (state: State): State => {
        return (state.focusedLocation && state.focusedLocation.column.idx < state.cellMatrix.last.column.idx) ?
            fc(state.focusedLocation.column.idx + 1, state.focusedLocation.row.idx, state) : state;
    }
}

export function withMoveFocusUp(fc: FocusCellFn) {
    return (state: State): State => {
        return (state.focusedLocation && state.focusedLocation.row.idx > 0) ?
            fc(state.focusedLocation.column.idx, state.focusedLocation.row.idx - 1, state) : state;
    }
}

export function withMoveFocusDown(fc: FocusCellFn) {
    return (state: State): State => {
        if (state.focusedLocation) {
            if (state.focusedLocation.row.idx === state.cellMatrix.last.row.idx)
                return fc(state.focusedLocation.column.idx, state.focusedLocation.row.idx, state)
            return fc(state.focusedLocation.column.idx, state.focusedLocation.row.idx + 1, state)
        }
        return state;
    }
}

function getVisibleHeight(state: State): number {
    const { stickyTopRange } = state.cellMatrix.ranges;
    const wholeStickyHeight = stickyTopRange.height;
    const visibleScrollAreaHeight = getVisibleScrollAreaHeight(state, wholeStickyHeight);
    return visibleScrollAreaHeight;
}

export function withMoveFocusPageUp(fc: FocusCellFn) {
    return (state: State): State => {
        const visibleScrollAreaHeight = getVisibleHeight(state);
        const location = state.focusedLocation;
        if (!state.focusedLocation)
            return state;

        const hasTopSticky = state.cellMatrix.ranges.stickyTopRange.rows.length > 0;
        const isOnTopSticky = hasTopSticky && isFocusLocationOnTopSticky(state, location!);
        const hasScrollableRange = state.cellMatrix.scrollableRange.rows.length > 0;
        const isOnFirstElementOnScrollableRange = hasScrollableRange && location?.row.idx === state.cellMatrix.scrollableRange.first.row.idx;
        const rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(row => row.bottom < visibleScrollAreaHeight)
        const { stickyTopRange } = state.cellMatrix.ranges;

        let rowIdx = 0;
        if (isOnTopSticky) {
            rowIdx = state.cellMatrix.ranges.stickyTopRange.first.row.idx;
        } else if (isOnFirstElementOnScrollableRange) {
            rowIdx = stickyTopRange.rows.length > 0 ? state.cellMatrix.ranges.stickyTopRange.last.row.idx : state.cellMatrix.first.row.idx;
        } else if (location!.row.idx >= rowsOnScreen.length + state.cellMatrix.ranges.stickyTopRange.rows.length) {
            rowIdx = state.focusedLocation.row.idx - rowsOnScreen.length > 0
                ? state.focusedLocation.row.idx - rowsOnScreen.length
                : 0;
        } else {
            rowIdx = state.cellMatrix.scrollableRange.first.row.idx;
        }
        return fc(
            state.focusedLocation.column.idx,
            rowIdx,
            state
        );
    }
}

export function withMoveFocusPageDown(fc: FocusCellFn) {
    return (state: State): State => {
        const visibleScrollAreaHeight = getVisibleHeight(state);
        const location = state.focusedLocation;
        if (!state.focusedLocation)
            return state;
        const isOnTopSticky = isFocusLocationOnTopSticky(state, location!);
        const hasTopSticky = state.cellMatrix.ranges.stickyTopRange.rows.length > 0;
        const isOnLastRowOnTopSticky = hasTopSticky && location?.row.idx === state.cellMatrix.ranges?.stickyTopRange.last.row.idx;
        const hasScrollableRange = state.cellMatrix.scrollableRange.rows.length > 0;

        let rowIdx = 0;
        if (isOnTopSticky) {
            if (isOnTopSticky && !isOnLastRowOnTopSticky) {
                rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx;
            } else {
                hasScrollableRange ? rowIdx = state.cellMatrix.scrollableRange.first.row.idx : rowIdx = state.cellMatrix.ranges.stickyTopRange.last.row.idx;
            }
        } else {
            const rowsOnScreen = state.cellMatrix.scrollableRange.rows.filter(row => row.top + row.height < visibleScrollAreaHeight)
            rowIdx = state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
                ? state.focusedLocation.row.idx + rowsOnScreen.length
                : state.cellMatrix.rows.length - 1
        }
        return fc(
            state.focusedLocation.column.idx,
            rowIdx,
            state
        );
    }
}