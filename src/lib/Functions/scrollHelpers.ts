type ScrollableElement = HTMLElement | (Window & typeof globalThis) | undefined;

export function getScrollableParent(element: HTMLElement, includeHidden: boolean): ScrollableElement {
    let style = getComputedStyle(element);
    const excludeStaticParent = style.position === 'absolute';
    const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    if (style.position === 'fixed') return document.documentElement;
    for (let parent = element; ((parent as HTMLElement | null) = parent.parentElement);) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === 'static')
            continue;
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
            return parent;
    }
    return getTopScrollableElement();
}

export function getScrollOfScrollableElement(element: ScrollableElement): { scrollLeft: number, scrollTop: number } {
    const scrollLeft = element !== undefined ? ((element as HTMLElement).scrollLeft ?? getTopScrollableElement().scrollX) - ((element as HTMLElement).clientLeft || 0) : 0;
    const scrollTop = element !== undefined ? ((element as HTMLElement).scrollTop ?? getTopScrollableElement().scrollY) - ((element as HTMLElement).clientTop || 0) : 0;
    return { scrollLeft, scrollTop };
}

export function getTopScrollableElement(): Window & typeof globalThis {
    return window;
}