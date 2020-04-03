import { getTopScrollableElement, getScrollOfScrollableElement } from '.';
import { isIOS } from './operatingSystem';
export function getSizeOfElement(element) {
    var _a, _b;
    var width = element !== undefined ? ((_a = element.clientWidth) !== null && _a !== void 0 ? _a : (isIOS() ? window.innerWidth : document.documentElement.clientWidth)) : 0;
    var height = element !== undefined ? ((_b = element.clientHeight) !== null && _b !== void 0 ? _b : (isIOS() ? window.innerHeight : document.documentElement.clientHeight)) : 0;
    return { width: width, height: height };
}
export function getOffsetsOfElement(element) {
    var _a, _b;
    return { offsetLeft: (_a = element.offsetLeft) !== null && _a !== void 0 ? _a : 0, offsetTop: (_b = element.offsetTop) !== null && _b !== void 0 ? _b : 0 };
}
export function getReactGridOffsets(state) {
    var _a, _b, _c, _d;
    if (state.scrollableElement === getTopScrollableElement()) {
        var _e = getScrollOfScrollableElement(state.scrollableElement), scrollLeft = _e.scrollLeft, scrollTop = _e.scrollTop;
        var _f = state.reactGridElement.getBoundingClientRect(), left = _f.left, top_1 = _f.top;
        return { left: left + scrollLeft, top: top_1 + scrollTop };
    }
    else {
        return { left: (_b = (_a = state.reactGridElement) === null || _a === void 0 ? void 0 : _a.offsetLeft) !== null && _b !== void 0 ? _b : 0, top: (_d = (_c = state.reactGridElement) === null || _c === void 0 ? void 0 : _c.offsetTop) !== null && _d !== void 0 ? _d : 0 };
    }
}
export function getVisibleSizeOfReactGrid(state) {
    var _a, _b, _c, _d;
    var _e = getScrollOfScrollableElement(state.scrollableElement), scrollLeft = _e.scrollLeft, scrollTop = _e.scrollTop;
    var _f = getSizeOfElement(state.scrollableElement), widthOfScrollableElement = _f.width, heightOfScrollableElement = _f.height;
    var _g = getReactGridOffsets(state), left = _g.left, top = _g.top;
    var scrollBottom = scrollTop + heightOfScrollableElement, reactGridBottom = top + ((_b = (_a = state.reactGridElement) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 0), visibleTop = top < scrollTop ? scrollTop : top, visibleBottom = reactGridBottom > scrollBottom ? scrollBottom : reactGridBottom;
    var scrollRight = scrollLeft + widthOfScrollableElement, reactGridRight = left + ((_d = (_c = state.reactGridElement) === null || _c === void 0 ? void 0 : _c.offsetWidth) !== null && _d !== void 0 ? _d : 0), visibleLeft = left < scrollLeft ? scrollLeft : left, visibleRight = reactGridRight > scrollRight ? scrollRight : reactGridRight;
    var width = Math.max(visibleRight - visibleLeft, 0), height = Math.max(visibleBottom - visibleTop, 0);
    var visibleOffsetRight = scrollRight - visibleRight, visibleOffsetBottom = scrollBottom - visibleBottom;
    return { width: width, height: height, visibleOffsetRight: visibleOffsetRight, visibleOffsetBottom: visibleOffsetBottom };
}
export var getStickyOffset = function (scroll, offset) { return scroll > offset ? scroll - offset : 0; };
