import { getScrollOfScrollableElement } from './scrollHelpers';
import { getTopScrollableElement } from '.';
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
    var _a = getScrollOfScrollableElement(state.scrollableElement), scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
    var _b = state.reactGridElement.getBoundingClientRect(), leftReactGrid = _b.left, topReactGrid = _b.top;
    var left = leftReactGrid + scrollLeft, top = topReactGrid + scrollTop;
    if (state.scrollableElement !== getTopScrollableElement()) {
        var _c = state.scrollableElement.getBoundingClientRect(), leftScrollable = _c.left, topScrollable = _c.top;
        left -= leftScrollable;
        top -= topScrollable;
    }
    return { left: left, top: top };
}
export function getVisibleSizeOfReactGrid(state) {
    var _a = getScrollOfScrollableElement(state.scrollableElement), scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
    var _b = getSizeOfElement(state.scrollableElement), widthOfScrollableElement = _b.width, heightOfScrollableElement = _b.height;
    var _c = getReactGridOffsets(state), left = _c.left, top = _c.top;
    var scrollBottom = scrollTop + heightOfScrollableElement, reactGridBottom = top + state.cellMatrix.height, visibleTop = top < scrollTop ? scrollTop : top, visibleBottom = reactGridBottom > scrollBottom ? scrollBottom : reactGridBottom;
    var scrollRight = scrollLeft + widthOfScrollableElement, reactGridRight = left + state.cellMatrix.width, visibleLeft = left < scrollLeft ? scrollLeft : left, visibleRight = reactGridRight > scrollRight ? scrollRight : reactGridRight;
    var width = Math.max(visibleRight - visibleLeft, 0), height = Math.max(visibleBottom - visibleTop, 0);
    var visibleOffsetRight = scrollRight - visibleRight, visibleOffsetBottom = scrollBottom - visibleBottom;
    return { width: width, height: height, visibleOffsetRight: visibleOffsetRight, visibleOffsetBottom: visibleOffsetBottom };
}
export var getStickyOffset = function (scroll, offset) { return scroll > offset ? scroll - offset : 0; };
