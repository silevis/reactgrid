var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Range } from '../Model';
import { getScrollOfScrollableElement } from './scrollHelpers';
import { getVisibleSizeOfReactGrid, getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';
export var VS_PAGE_HEIGHT = 300;
export var VS_PAGE_WIDTH = 300;
export function recalcVisibleRange(state) {
    var _a = getScrollOfScrollableElement(state.scrollableElement), scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
    var _b = getVisibleScrollableSize(state, [-state.cellMatrix.ranges.stickyTopRange.height], [-state.cellMatrix.ranges.stickyLeftRange.width]), width = _b.width, height = _b.height;
    var visibleColumns = getVisibleColumns(state, width);
    var visibleRows = getVisibleRows(state, height);
    var visibleRange = new Range(visibleRows, visibleColumns);
    return __assign(__assign({}, state), { leftScrollBoudary: visibleRange.columns.length > 0 ? scrollLeft - VS_PAGE_WIDTH : 0, rightScrollBoudary: visibleRange.last.column === undefined ? 0 : VS_PAGE_WIDTH + scrollLeft, topScrollBoudary: visibleRange.columns.length > 0 ? scrollTop - VS_PAGE_HEIGHT : 0, bottomScrollBoudary: visibleRange.last.row === undefined ? 0 : VS_PAGE_HEIGHT + scrollTop, visibleRange: visibleRange });
}
export function getVisibleScrollableSize(state, heights, widths) {
    var _a = getVisibleSizeOfReactGrid(state), height = _a.height, width = _a.width;
    var sum = function (a, b) { return a + b; };
    return {
        height: Math.max(heights.reduce(sum, height), 0),
        width: Math.max(widths.reduce(sum, width), 0)
    };
}
export function getVisibleColumns(state, scrollableWidth) {
    var left = getReactGridOffsets(state).left;
    var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
    var firstIndex = colBinarySearch(state.cellMatrix.scrollableRange.columns, scrollLeft - left - VS_PAGE_HEIGHT);
    var lastIndex = colBinarySearch(state.cellMatrix.scrollableRange.columns, scrollableWidth + getStickyOffset(scrollLeft, left) + VS_PAGE_HEIGHT, firstIndex);
    return state.cellMatrix.scrollableRange.columns.slice(firstIndex, lastIndex + 1);
}
export function getVisibleRows(state, scrollableHeight) {
    var top = getReactGridOffsets(state).top;
    var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
    var firstIndex = rowBinarySearch(state.cellMatrix.scrollableRange.rows, scrollTop - top - VS_PAGE_HEIGHT);
    var lastIndex = rowBinarySearch(state.cellMatrix.scrollableRange.rows, scrollableHeight + getStickyOffset(scrollTop, top) + VS_PAGE_HEIGHT, firstIndex);
    return state.cellMatrix.scrollableRange.rows.slice(firstIndex, lastIndex + 1);
}
function rowBinarySearch(arr, val, start, end) {
    if (start === void 0) { start = 0; }
    if (end === void 0) { end = arr.length - 1; }
    var mid = (start + end) >> 1;
    if (mid < 0)
        return 0;
    if (start >= end)
        return mid;
    return val < arr[mid].top
        ? rowBinarySearch(arr, val, start, mid)
        : rowBinarySearch(arr, val, mid + 1, end);
}
function colBinarySearch(arr, val, start, end) {
    if (start === void 0) { start = 0; }
    if (end === void 0) { end = arr.length - 1; }
    var mid = (start + end) >> 1;
    ;
    if (mid < 0)
        return 0;
    if (start >= end)
        return mid;
    return val < arr[mid].left
        ? colBinarySearch(arr, val, start, mid)
        : colBinarySearch(arr, val, mid + 1, end);
}
