import { emptyCell } from './emptyCell';
import { tryAppendChange } from './tryAppendChange';
export function wipeSelectedRanges(state) {
    var location = state.focusedLocation;
    return location ? tryAppendChange(state, { row: location.row, column: location.column }, emptyCell) : state;
}
