import { KeyboardEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { tryAppendChange } from './tryAppendChange';

export function handleCompositionEndOnCellTemplate(state: State, event: CompositionEvent): State {
    const { focusedLocation: location } = state;
    if (!location) {
        return state;
    }
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    if (cellTemplate.handleCompositionEnd && !state.currentlyEditedCell) { // TODO need add !(event.shiftKey && event.keyCode === keyCodes.SPACE) to working keycodes (shift + space) in a lower condition
        const { cell: newCell, enableEditMode } = cellTemplate.handleCompositionEnd(cell, event.data);
        if (JSON.stringify(newCell) !== JSON.stringify(cell) || enableEditMode) {
            if (enableEditMode && !cell.nonEditable) {
                return { ...state, currentlyEditedCell: newCell }
            } else {
                return tryAppendChange(state, location, newCell);
            }
        }
    }
    return state;
}
