import { PointerEvent } from '../Model/domEventsTypes';
import { getLocationFromClient } from './getLocationFromClient';
import { State } from '../Model/State';
import { focusLocation } from './focusLocation';


export function handleContextMenu(event: PointerEvent, state: State): State {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    const top = window.innerHeight - clickY > 25;
    const right = window.innerWidth - clickX > 120;
    const bottom = !top;
    const left = !right;
    const contextMenuPosition = state.contextMenuPosition;
    if (top) { contextMenuPosition.top = clickY; }
    if (right) { contextMenuPosition.left = clickX + 5; }
    if (bottom) { contextMenuPosition.top = clickY - 25 - 5; }
    if (left) { contextMenuPosition.left = clickX - 120 - 5; }
    const focusedLocation = getLocationFromClient(state, clickX, clickY);
    if (!state.selectedRanges.find(range => range.contains(focusedLocation))) {
        state = focusLocation(state, focusedLocation)
    }
    return {
        ...state,
        contextMenuPosition
    }
}
