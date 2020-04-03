declare type ScrollableElement = HTMLElement | (Window & typeof globalThis);
export declare function getScrollableParent(element: HTMLElement, includeHidden: boolean): ScrollableElement;
export declare function getScrollOfScrollableElement(element: ScrollableElement): {
    scrollLeft: number;
    scrollTop: number;
};
export declare function getTopScrollableElement(): Window & typeof globalThis;
export {};
