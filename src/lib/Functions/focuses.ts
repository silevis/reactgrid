import { State } from "../Model";
import { focusLocation } from "./focusLocation";

export function focusCell(colIdx: number, rowIdx: number, state: State): State {
    const location = state.cellMatrix.getLocation(rowIdx, colIdx);
    return focusLocation(state, location);
}

export function moveFocusLeft(state: State): State {
    return (state.focusedLocation && state.focusedLocation.column.idx > 0) ?
        focusCell(state.focusedLocation.column.idx - 1, state.focusedLocation.row.idx, state) : state;
}

export function moveFocusRight(state: State): State {
    return (state.focusedLocation && state.focusedLocation.column.idx < state.cellMatrix.last.column.idx) ?
        focusCell(state.focusedLocation.column.idx + 1, state.focusedLocation.row.idx, state) : state;
}

export function moveFocusUp(state: State): State {
    return (state.focusedLocation && state.focusedLocation.row.idx > 0) ?
        focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx - 1, state) : state;
}

export function moveFocusDown(state: State): State {
    if (state.focusedLocation) {
        if (state.focusedLocation.row.idx === state.cellMatrix.last.row.idx)
            return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx, state)
        return focusCell(state.focusedLocation.column.idx, state.focusedLocation.row.idx + 1, state)
    }
    return state;
}

// TODO this should be rewritten, not working propely
export function moveFocusPageUp(state: State): State {
    if (!state.focusedLocation)
        return state;
    const rowsOnScreen = state.cellMatrix.rows.filter(
        row => row.top < state.reactGridElement!.clientHeight // TODO check this line
    );
    return focusCell(
        state.focusedLocation.column.idx,
        state.focusedLocation.row.idx - rowsOnScreen.length > 0
            ? state.focusedLocation.row.idx - rowsOnScreen.length
            : 0, state
    );
}

// TODO this should be rewritten, not working propely
export function moveFocusPageDown(state: State): State {
    if (!state.focusedLocation)
        return state;
    const rowsOnScreen = state.cellMatrix.rows
        .slice(state.cellMatrix.stickyTopRange.rows.length, state.cellMatrix.rows.length)
        .filter(row => row.top + row.height < state.reactGridElement!.clientHeight);
    return focusCell(
        state.focusedLocation.column.idx,
        state.focusedLocation.row.idx + rowsOnScreen.length < state.cellMatrix.rows.length
            ? state.focusedLocation.row.idx + rowsOnScreen.length
            : state.cellMatrix.rows.length - 1, state
    );
}