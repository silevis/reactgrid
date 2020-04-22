import { State, CellLocation } from '../Model';

export function setInitialFocusLocation(state: State, focusLocation: CellLocation | undefined): State {
    if (focusLocation && !state.focusedLocation) {
        state = {
            ...state,
            focusedLocation: state.cellMatrix.getLocationById(focusLocation.rowId, focusLocation.columnId)
        }
    }
    return state;
}