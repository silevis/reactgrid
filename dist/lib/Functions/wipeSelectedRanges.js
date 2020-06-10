import { tryAppendChange, emptyCell } from '.';
export function wipeSelectedRanges(state) {
    var location = state.focusedLocation;
    return location ? tryAppendChange(state, { row: location.row, column: location.column }, emptyCell) : state;
}
