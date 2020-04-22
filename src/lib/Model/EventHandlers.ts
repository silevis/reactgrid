import { StateUpdater, PointerEvent, ClipboardEvent, KeyboardEvent } from '.';
import { recalcVisibleRange, getScrollableParent, getScrollOfScrollableElement } from '../Functions';
import { getReactGridOffsets, getVisibleSizeOfReactGrid } from '../Functions/elementSizeHelpers';
import { AbstractPointerEventsController } from './AbstractPointerEventsController';

export class EventHandlers {

    constructor(public updateState: StateUpdater, public pointerEventsController: AbstractPointerEventsController) { }

    pointerDownHandler = (event: PointerEvent) => this.updateState(state => this.pointerEventsController.handlePointerDown(event, state));
    keyDownHandler = (event: KeyboardEvent) => this.updateState(state => state.currentBehavior.handleKeyDown(event, state));
    keyUpHandler = (event: KeyboardEvent) => this.updateState(state => state.currentBehavior.handleKeyUp(event, state));
    copyHandler = (event: ClipboardEvent) => this.updateState(state => state.currentBehavior.handleCopy(event, state));
    pasteHandler = (event: ClipboardEvent) => this.updateState(state => state.currentBehavior.handlePaste(event, state));
    cutHandler = (event: ClipboardEvent) => this.updateState(state => state.currentBehavior.handleCut(event, state));
    windowResizeHandler = () => this.updateState(recalcVisibleRange);
    reactgridRefHandler = (reactGridElement: HTMLDivElement) => {
        if (reactGridElement) {
            this.updateState(state => {
                const scrollableElement = getScrollableParent(reactGridElement, true);
                scrollableElement!.addEventListener('scroll', this.scrollHandler);
                return recalcVisibleRange({ ...state, reactGridElement, scrollableElement });
            })
        }
    };
    hiddenElementRefHandler = (hiddenFocusElement: HTMLInputElement) => this.updateState(state => { state.hiddenFocusElement = hiddenFocusElement; return state });

    pasteCaptureHandler = (event: ClipboardEvent) => {
        const htmlData = event.clipboardData!.getData('text/html');
        const parsedData = new DOMParser().parseFromString(htmlData, 'text/html');
        if (htmlData && parsedData.body.firstElementChild!.getAttribute('data-reactgrid') === 'reactgrid-content') {
            event.bubbles = false;
        }
    };

    scrollHandler = () =>
        this.updateState(state => {
            const { scrollTop, scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
            const { top, left } = getReactGridOffsets(state);
            const { width, height } = getVisibleSizeOfReactGrid(state);
            const shouldBeVisibleRangeRecalc = width > 0 && height > 0 && (
                scrollTop > state.maxScrollTop
                || scrollTop < state.minScrollTop
                || scrollLeft > state.maxScrollLeft
                || scrollLeft < state.minScrollLeft
                || scrollLeft === 0
                || scrollLeft - left > state.visibleRange!.first.column.right
                || scrollLeft - left < state.visibleRange!.last.column.left - width
                || scrollTop - top > (state.visibleRange!.first.row?.bottom ?? 0)
                || scrollTop - top < (state.visibleRange!.last.row?.top ?? 0) - height
                || scrollTop === 0);
            return shouldBeVisibleRangeRecalc ? recalcVisibleRange(state) : state;
        });
}