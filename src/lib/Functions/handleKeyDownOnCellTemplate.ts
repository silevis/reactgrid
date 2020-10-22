import { KeyboardEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { isSelectionKey } from './isSelectionKey';
import { tryAppendChange } from './tryAppendChange';

export function handleKeyDownOnCellTemplate(state: State, event: KeyboardEvent): State {
    const location = state.focusedLocation!;
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    if (cellTemplate.handleKeyDown && !state.currentlyEditedCell) { // TODO need add !(event.shiftKey && event.keyCode === keyCodes.SPACE) to working keycodes (shift + space) in a lower condition
        const { cell: newCell, enableEditMode } = cellTemplate.handleKeyDown(cell, event.keyCode, isSelectionKey(event), event.shiftKey, event.altKey);
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