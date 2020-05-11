import { getScrollOfScrollableElement } from './scrollHelpers';
import { getTopScrollableElement } from '.';
import { State } from '../Model';
import { isIOS } from './operatingSystem';

export function getSizeOfElement(element: any): { width: number, height: number } {
    const width = element !== undefined ? (element.clientWidth ?? (isIOS() ? window.innerWidth : document.documentElement.clientWidth)) : 0; // TODO check other mobile devices
    const height = element !== undefined ? (element.clientHeight ?? (isIOS() ? window.innerHeight : document.documentElement.clientHeight)) : 0;
    return { width, height };
}

export function getOffsetsOfElement(element: any): { offsetLeft: number, offsetTop: number } {
    return { offsetLeft: element.offsetLeft ?? 0, offsetTop: element.offsetTop ?? 0 };
}

export function getReactGridOffsets(state: State): { left: number, top: number } {
    if (state.scrollableElement === getTopScrollableElement()) {
        const { scrollLeft, scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
        const { left, top } = state.reactGridElement!.getBoundingClientRect();
        return { left: left + scrollLeft, top: top + scrollTop }
    } else {
        return { left: state.reactGridElement?.offsetLeft ?? 0, top: state.reactGridElement?.offsetTop ?? 0 }
    }
}

export function getReactGridOffsetsForCellEditor(state: State): { left: number, top: number } {
    const { scrollLeft, scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { left, top } = state.reactGridElement!.getBoundingClientRect();
    const { offsetLeft, offsetTop } = getOffsetsOfElement(state.scrollableElement!);
    if (state.scrollableElement === getTopScrollableElement()) {
        return { left: left + scrollLeft - offsetLeft, top: top + scrollTop - offsetTop }
    } else {
        return {
            left: left + scrollLeft - offsetLeft + getTopScrollableElement().scrollX,
            top: top + scrollTop - offsetTop + getTopScrollableElement().scrollY
        }
    }
}

export function getVisibleSizeOfReactGrid(state: State): { width: number, height: number, visibleOffsetRight: number, visibleOffsetBottom: number } {
    const { scrollLeft, scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { width: widthOfScrollableElement, height: heightOfScrollableElement } = getSizeOfElement(state.scrollableElement!);
    const { left, top } = getReactGridOffsets(state);

    const scrollBottom = scrollTop + heightOfScrollableElement,
        reactGridBottom = top + (state.reactGridElement?.offsetHeight ?? 0),
        visibleTop = top < scrollTop ? scrollTop : top,
        visibleBottom = reactGridBottom > scrollBottom ? scrollBottom : reactGridBottom;

    const scrollRight = scrollLeft + widthOfScrollableElement,
        reactGridRight = left + (state.reactGridElement?.offsetWidth ?? 0),
        visibleLeft = left < scrollLeft ? scrollLeft : left,
        visibleRight = reactGridRight > scrollRight ? scrollRight : reactGridRight;

    const width = Math.max(visibleRight - visibleLeft, 0),
        height = Math.max(visibleBottom - visibleTop, 0);
    const visibleOffsetRight = scrollRight - visibleRight,
        visibleOffsetBottom = scrollBottom - visibleBottom;
    return { width, height, visibleOffsetRight, visibleOffsetBottom };
}

export const getStickyOffset = (scroll: number, offset: number): number => scroll > offset ? scroll - offset : 0;