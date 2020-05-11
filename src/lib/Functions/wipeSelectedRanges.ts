import { State } from '../Model';
import { tryAppendChange, emptyCell } from '.';

export function wipeSelectedRanges(state: State): State {
    const location = state.focusedLocation;
    return location ? tryAppendChange(state, { row: location.row, column: location.column }, emptyCell) : state;
}