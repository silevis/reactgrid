import { AbstractPointerEventsController } from './AbstractPointerEventsController';
import { StateModifier, StateUpdater } from './State';
import { PointerEvent, KeyboardEvent, ClipboardEvent, FocusEvent } from './domEventsTypes';
export declare class EventHandlers {
    updateState: StateUpdater;
    pointerEventsController: AbstractPointerEventsController;
    constructor(updateState: StateUpdater, pointerEventsController: AbstractPointerEventsController);
    pointerDownHandler: (event: PointerEvent) => void;
    keyDownHandler: (event: KeyboardEvent) => void;
    keyUpHandler: (event: KeyboardEvent) => void;
    compositionEndHandler: (event: CompositionEvent) => void;
    copyHandler: (event: ClipboardEvent) => void;
    pasteHandler: (event: ClipboardEvent) => void;
    cutHandler: (event: ClipboardEvent) => void;
    blurHandler: (event: FocusEvent) => void;
    windowResizeHandler: () => void;
    reactgridRefHandler: (reactGridElement: HTMLDivElement) => void;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
    pasteCaptureHandler: (event: ClipboardEvent) => void;
    protected scrollHandlerInternal: (visibleRangeCalculator: StateModifier) => void;
    scrollHandler: () => void;
    protected assignElementsRefs: (reactGridElement: HTMLDivElement, visibleRangeCalculator: StateModifier) => void;
    protected updateOnScrollChange: (visibleRangeCalculator: StateModifier) => void;
}
