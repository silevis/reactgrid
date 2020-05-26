import { State, Location } from '../Model';
import { tryAppendChange } from './tryAppendChange';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';


export function focusLocation(state: State, location: Location): State {
    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }

    const { onFocusLocationChanged, onFocusLocationChanging } = state.props!;
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const cellLocation = { rowId: location.row.rowId, columnId: location.column.columnId };

    const isFocusable = (!cellTemplate.isFocusable || cellTemplate.isFocusable(cell)) &&
        (!onFocusLocationChanging || onFocusLocationChanging(cellLocation));

    if (!isFocusable)
        return state;

    onFocusLocationChanged && onFocusLocationChanged(cellLocation);

    return {
        ...state,
        focusedLocation: state.cellMatrix.validateLocation(location),
        currentlyEditedCell: undefined // TODO disable in derived state from props
    };
}
