import { State, Location } from '../Model';
import { tryAppendChange } from './tryAppendChange';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';


export function focusLocation(state: State, location: Location): State {
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }

    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocusable = !cellTemplate.isFocusable || cellTemplate.isFocusable(cell);

    if (!isFocusable)
        return state;

    // TODO if return false then no focus change
    // onFocusLocationChanging - handle returned value

    const { onFocusLocationChanged } = state.props!;
    onFocusLocationChanged && onFocusLocationChanged({ rowId: location.row.rowId, columnId: location.column.columnId });

    return {
        ...state,
        focusedLocation: state.cellMatrix.validateLocation(location),
        currentlyEditedCell: undefined // TODO disable in derived state from props
    };
}
