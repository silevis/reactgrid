import { StateUpdater, PointerEvent, ClipboardEvent, KeyboardEvent, StateModifier } from '.';
import { AbstractPointerEventsController } from './AbstractPointerEventsController';
export declare class EventHandlers {
    updateState: StateUpdater;
    pointerEventsController: AbstractPointerEventsController;
    constructor(updateState: StateUpdater, pointerEventsController: AbstractPointerEventsController);
    pointerDownHandler: (event: PointerEvent) => void;
    keyDownHandler: (event: KeyboardEvent) => void;
    keyUpHandler: (event: KeyboardEvent) => void;
    copyHandler: (event: ClipboardEvent) => void;
    pasteHandler: (event: ClipboardEvent) => void;
    cutHandler: (event: ClipboardEvent) => void;
    windowResizeHandler: () => void;
    reactgridRefHandler: (reactGridElement: HTMLDivElement) => void;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
    pasteCaptureHandler: (event: ClipboardEvent) => void;
    scrollHandler: (visibleRangeCalculator: StateModifier) => void;
    protected assignScrollHandler: (reactGridElement: HTMLDivElement, visibleRangeCalculator: StateModifier) => void;
    protected updateOnScrollChange: (visibleRangeCalculator: StateModifier) => void;
}
