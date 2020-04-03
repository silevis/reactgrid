import { State, CellLocation } from '../Model';

export function setInitialFocusLocation(state: State, locationToFocus: CellLocation | undefined): State {
    if (locationToFocus && !state.focusedLocation) {
        // TODO rewrite using focusLocation function, 
        state = {
            ...state,
            focusedLocation: state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId)
        }
    }
    return state;
}