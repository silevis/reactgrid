type ScrollableElement = HTMLElement | ReturnType<typeof getTopScrollableElement> | undefined;
export declare function getScrollableParent(element: HTMLElement, includeHidden: boolean): ScrollableElement;
export declare function getScrollOfScrollableElement(element: ScrollableElement): {
    scrollLeft: number;
    scrollTop: number;
};
export declare function getTopScrollableElement(): Window & typeof globalThis;
export {};
