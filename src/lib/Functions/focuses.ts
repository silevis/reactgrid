import { State, Location } from "../Model";
import { focusLocation } from "./focusLocation";


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

// TODO this should be rewritten, not working propely 
export function withMoveFocusPageUp(fc: FocusCellFn) {
    return (state: State): State => {
        if (!state.focusedLocation)
            return state;
        const rowsOnScreen = state.cellMatrix.rows.filter(
            row => row.top < state.reactGridElement!.clientHeight // TODO check this line
        );
        return fc(
            state.focusedLocation.column.idx,
            state.focusedLocation.row.idx - rowsOnScreen.length > 0
                ? state.focusedLocation.row.idx - rowsOnScreen.length
                : 0, state
        );
    }
}

// TODO this should be rewritten, not working propely
export function withMoveFocusPageDown(fc: FocusCellFn) {
    return (state: State): State => {
        if (!state.focusedLocation)
            return state;
        const rowsOnScreen = state.cellMatrix.rows
            .slice(state.cellMatrix.ranges.stickyTopRange.rows.length, state.cellMatrix.rows.length)
            .filter(row => row.top + row.height < state.reactGridElement!.clientHeight);
        return fc(
            state.focusedLocation.column.idx,
            state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
                ? state.focusedLocation.row.idx + rowsOnScreen.length
                : state.cellMatrix.rows.length - 1, state
        );
    }
}