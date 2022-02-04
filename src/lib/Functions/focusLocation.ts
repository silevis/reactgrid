import { State, } from '../Model/State';
import { Location } from '../Model/InternalModel';
import { tryAppendChange } from './tryAppendChange';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { areLocationsEqual } from './areLocationsEqual';
import { resetSelection } from './selectRange';


export function focusLocation(state: State, location: Location, applyResetSelection = true): State {
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }

    if (!state.props) {
        throw new Error(`"props" field on "state" object should be initiated before possible location focus`);
    }
    

    const { onFocusLocationChanged, onFocusLocationChanging, focusLocation } = state.props;

    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const cellLocation = { rowId: location.row.rowId, columnId: location.column.columnId };

    const isChangeAllowedByUser = !onFocusLocationChanging || onFocusLocationChanging(cellLocation);

    const isCellTemplateFocusable = !cellTemplate.isFocusable || cellTemplate.isFocusable(cell);

    const forcedLocation = focusLocation
        ? state.cellMatrix.getLocationById(focusLocation.rowId, focusLocation.columnId)
        : undefined;

    const isLocationAcceptable = areLocationsEqual(location, state.focusedLocation)
        || (forcedLocation ? areLocationsEqual(location, forcedLocation) : true);

    if (!isCellTemplateFocusable || !isChangeAllowedByUser || !isLocationAcceptable) {
        return state;
    }

    if (onFocusLocationChanged) {
        onFocusLocationChanged(cellLocation);
    }

    const validatedFocusLocation = state.cellMatrix.validateLocation(location);

    if (applyResetSelection && state.focusedLocation) {
        // TODO is `location` really needed
        state = resetSelection(
          state,
          validatedFocusLocation
        );
    }


    return {
        ...state,
        focusedLocation: validatedFocusLocation,
        contextMenuPosition: { top: -1, left: -1 },
        currentlyEditedCell: undefined // TODO disable in derived state from props
    };
}
