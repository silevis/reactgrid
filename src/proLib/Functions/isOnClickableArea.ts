import { ProState } from '../Model/ProState';
import { PointerEvent } from '../Model/domEventsTypes';

export function isOnClickableAreaOnPro(event: PointerEvent, state: ProState): boolean {
    if (!state.reactGridElement) {
        throw new Error(`"state.reactGridElement" field should be initiated before calling the "getBoundingClientRect()"`);
    }
    const { left, right } = state.reactGridElement.getBoundingClientRect();
    const scrollableContentX = event.clientX - left;
    const rightPaneWidth = state.cellMatrix.ranges.stickyRightRange.width;
    if (scrollableContentX >= state.cellMatrix.width - rightPaneWidth && !(event.clientX >= right - rightPaneWidth)) {
        return false;
    }
    return true;
}
