import { State } from '../Model/State';
import { Range } from '../Model/Range';

export function getActiveSelectedRange(state: State): Range {
    return state.selectedRanges[state.activeSelectedRangeIdx];
}
