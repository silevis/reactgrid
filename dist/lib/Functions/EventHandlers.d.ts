import { StateUpdater, PointerEvent, ClipboardEvent, KeyboardEvent } from '../Model';
export declare class EventHandlers {
    private updateState;
    constructor(updateState: StateUpdater);
    private pointerEventsController;
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
    scrollHandler: () => void;
}
