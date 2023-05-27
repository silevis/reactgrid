import { PointerEvent } from './domEventsTypes';
import { AbstractPointerEventsController } from './AbstractPointerEventsController';
import { State } from './State';
export declare class PointerEventsController extends AbstractPointerEventsController {
    private isFromLeftToRightScroll?;
    private isFromRightToLeftScroll?;
    private isInLeftSticky?;
    private isInRightSticky?;
    private isFromTopToBottomScroll?;
    private isInTopSticky?;
    private isFromBottomToTopScroll?;
    private isInBottomSticky?;
    handlePointerDown: (event: PointerEvent, state: State) => State;
    private handleHideContextMenu;
    private isContainElement;
    private handleContextMenu;
    private handlePointerMove;
    private handlePointerUp;
}
