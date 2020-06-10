export function getActiveSelectedRange(state) {
    return state.cellMatrix.getRange(state.focusedLocation, state.focusedLocation);
}
