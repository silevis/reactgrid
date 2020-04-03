import { State, Range } from '../Model';

export function getActiveSelectedRange(state: State): Range {
    return state.cellMatrix.getRange(state.focusedLocation!, state.focusedLocation!)
}