import { State, Location } from '../Model';
import { scrollIntoView } from './scrollIntoView';
import { tryAppendChange } from './tryAppendChange';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';


export function focusLocation(state: State, location: Location): State {
    // TODO scroll into view after changing state !?
    scrollIntoView(state, location);

    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }

    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocusable = !cellTemplate.isFocusable || cellTemplate.isFocusable(cell);

    if (!isFocusable)
        return state;

    state.props.onFocusLocationChanged && state.props.onFocusLocationChanged({ rowId: location.row.rowId, columnId: location.column.columnId });

    return {
        ...state,
        focusedLocation: state.cellMatrix.validateLocation(location),
    };
}
