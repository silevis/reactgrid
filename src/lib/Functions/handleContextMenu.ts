import { PointerEvent } from '../Model/domEventsTypes';
import { getLocationFromClient } from './getLocationFromClient';
import { State } from '../Model/State';
import { focusLocation } from './focusLocation';


export function handleContextMenu(event: PointerEvent, state: State): State {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    const contextMenuPosition = state.contextMenuPosition;
    contextMenuPosition.top = clickY;
    contextMenuPosition.left = clickX;
    const focusedLocation = getLocationFromClient(state, clickX, clickY);
    if (!state.selectedRanges.find(range => range.contains(focusedLocation))) {
        state = focusLocation(state, focusedLocation)
    }
    return {
        ...state,
        contextMenuPosition
    }
}
