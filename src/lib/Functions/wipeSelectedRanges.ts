import { State } from '../Model/State';
import { emptyCell } from './emptyCell';
import { tryAppendChange } from './tryAppendChange';

export function wipeSelectedRanges(state: State): State {
    const location = state.focusedLocation;
    return location ? tryAppendChange(state, { row: location.row, column: location.column }, emptyCell) : state;
}