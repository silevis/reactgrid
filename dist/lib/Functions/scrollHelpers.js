export function getScrollableParent(element, includeHidden) {
    var style = getComputedStyle(element);
    var excludeStaticParent = style.position === 'absolute';
    var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    if (style.position === 'fixed')
        return document.documentElement;
    for (var parent_1 = element; (parent_1 = parent_1.parentElement);) {
        style = getComputedStyle(parent_1);
        if (excludeStaticParent && style.position === 'static')
            continue;
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
            return parent_1;
    }
    return getTopScrollableElement();
}
export function getScrollOfScrollableElement(element) {
    var _a, _b;
    var scrollLeft = element !== undefined ? ((_a = element.scrollLeft) !== null && _a !== void 0 ? _a : getTopScrollableElement().scrollX) - (element.clientLeft || 0) : 0;
    var scrollTop = element !== undefined ? ((_b = element.scrollTop) !== null && _b !== void 0 ? _b : getTopScrollableElement().scrollY) - (element.clientTop || 0) : 0;
    return { scrollLeft: scrollLeft, scrollTop: scrollTop };
}
export function getTopScrollableElement() {
    return window;
}
