import { State, Behavior, KeyboardEvent, ClipboardEvent, PointerEvent, Location, PointerLocation } from "../Model";
import { handleKeyDown } from "../Functions/handleKeyDown";
import { keyCodes, isBrowserSafari } from "../Functions";
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { areLocationsEqual } from '../Functions/areLocationsEqual';
import { isSelectionKey } from '../Functions/isSelectionKey';
import { CellSelectionBehavior } from './CellSelectionBehavior';
import { handlePaste } from '../Functions/handlePaste';
import { copySelectedRangeToClipboardOnSafari, copySelectedRangeToClipboard } from '../Functions/copySelectedRange';

export class DefaultBehavior extends Behavior {

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State {
        state = { ...state, currentBehavior: this.getNewBehavior(event, location, state) };
        return state.currentBehavior.handlePointerDown(event, location, state);
    }

    private getNewBehavior(event: PointerEvent | KeyboardEvent, location: PointerLocation, state: State): Behavior {
        return new CellSelectionBehavior();
    }

    handleDoubleClick(event: PointerEvent, location: Location, state: State): State {
        if (areLocationsEqual(location, state.focusedLocation)) {
            const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
            //const cellTemplate = state.cellTemplates[location.cell.type];
            if (cellTemplate.handleKeyDown) {
                const { cell: newCell, enableEditMode } = cellTemplate.handleKeyDown(cell, 1, isSelectionKey(event), event.shiftKey, event.altKey);
                if (enableEditMode) {
                    return { ...state, currentlyEditedCell: newCell };
                }
            }
        }
        return state;
    }

    handleKeyDown(event: KeyboardEvent, state: State): State {
        return handleKeyDown(state, event);
    }

    handleKeyUp(event: KeyboardEvent, state: State): State {
        if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
            event.preventDefault();
            event.stopPropagation();
        }
        return state;
    }

    handleCopy(event: ClipboardEvent, state: State): State {
        if (isBrowserSafari()) {
            copySelectedRangeToClipboardOnSafari(event, state);
        } else {
            copySelectedRangeToClipboard(state);
        }
        event.preventDefault();
        return { ...state };
    }

    handlePaste(event: ClipboardEvent, state: State): State {
        return handlePaste(event, state);
    }

    handleCut(event: ClipboardEvent, state: State): State {
        if (isBrowserSafari()) {
            copySelectedRangeToClipboardOnSafari(event, state, true);
        } else {
            copySelectedRangeToClipboard(state, true);
        }
        event.preventDefault();
        return state;
    }

}