import { State, } from '../Model/State';
import { Location } from '../Model/InternalModel';
import { tryAppendChange } from './tryAppendChange';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { areLocationsEqual } from './areLocationsEqual';


export function focusLocation(state: State, location: Location): State {
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }

    const { onFocusLocationChanged, onFocusLocationChanging, focusLocation } = state.props!;

    if (focusLocation) {
        location = state.cellMatrix.getLocationById(focusLocation.rowId, focusLocation.columnId);
    }

    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const cellLocation = { rowId: location.row.rowId, columnId: location.column.columnId };

    const wasChangePrevented = !onFocusLocationChanging || onFocusLocationChanging(cellLocation);

    const isFocusable = (!cellTemplate.isFocusable || cellTemplate.isFocusable(cell)) && wasChangePrevented;

    const validatedFocusLocation = state.cellMatrix.validateLocation(location);

    if (!isFocusable) {
        return state;
    }

    onFocusLocationChanged && (!focusLocation && areLocationsEqual(location, validatedFocusLocation))
        && onFocusLocationChanged(cellLocation);

    return {
        ...state,
        focusedLocation: validatedFocusLocation,
        currentlyEditedCell: undefined // TODO disable in derived state from props
    };
}
