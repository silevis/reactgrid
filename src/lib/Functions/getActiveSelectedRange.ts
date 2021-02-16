import { State } from '../Model/State';
import { Range } from '../Model/Range';

export function getActiveSelectedRange(state: State): Range {
    const { focusedLocation: location } = state;
    if (!location) {
        throw new Error(`Focus location is unknown for getting active selected range`);
    }
    return state.cellMatrix.getRange(location, location);
}
