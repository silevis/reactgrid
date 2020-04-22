import { State, Location } from '../Model';
import { scrollIntoView } from './scrollIntoView';
import { tryAppendChange } from './tryAppendChange';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';


export function focusLocation(state: State, location: Location, applyResetSelection = true): State {
    // TODO scroll into view after changing state !?
    scrollIntoView(state, location);



    if (state.focusedLocation && state.currentlyEditedCell) {
        state = tryAppendChange(state, state.focusedLocation, state.currentlyEditedCell);
    }

    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocusable = !cellTemplate.isFocusable || cellTemplate.isFocusable(cell);

    if (!isFocusable)
        return state;

    const { onFocusLocationChanged } = state.props!;
    onFocusLocationChanged && onFocusLocationChanged({ rowId: location.row.rowId, columnId: location.column.columnId });

    return {
        ...state,
        focusedLocation: location,
        currentlyEditedCell: undefined // TODO disable in derived state from props
    };
}
