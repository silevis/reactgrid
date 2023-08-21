import { Location } from '../Model/InternalModel';
import { PointerEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
import { areLocationsEqual } from './areLocationsEqual';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { isSelectionKey } from './isSelectionKey';

export function handleDoubleClick(event: PointerEvent, location: Location, state: State): State {
    if (areLocationsEqual(location, state.focusedLocation)) {
        const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
        if (cellTemplate.handleKeyDown) {
            const { cell: newCell, enableEditMode } = cellTemplate.handleKeyDown(cell, 1, isSelectionKey(event), event.shiftKey, event.altKey, "DoubleClick");
            if (enableEditMode && !cell.nonEditable) {
                return { ...state, currentlyEditedCell: newCell };
            }
        }
    }
    return state;
}