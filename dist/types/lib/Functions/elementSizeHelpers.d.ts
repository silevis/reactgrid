import { State } from '../Model/State';
export declare function getSizeOfElement(element: HTMLElement | (Window & typeof globalThis) | undefined): {
    width: number;
    height: number;
};
export declare function getReactGridOffsets(state: State): {
    left: number;
    top: number;
};
export declare function getVisibleSizeOfReactGrid(state: State): {
    width: number;
    height: number;
    visibleOffsetRight: number;
    visibleOffsetBottom: number;
};
export declare const getStickyOffset: (scroll: number, offset: number) => number;
