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
import { getScrollOfScrollableElement } from '.';
import { getVisibleSizeOfReactGrid, getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';
export function recalcVisibleRange(state) {
    var cellMatrix = state.cellMatrix;
    var _a = getScrollOfScrollableElement(state.scrollableElement), scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
    var _b = getVisibleSizeOfReactGrid(state), height = _b.height, width = _b.width;
    var visibleScrollableAreaHeight = Math.max(height - cellMatrix.stickyTopRange.height, 0);
    var visibleScrollableAreaWidth = Math.max(width - cellMatrix.stickyLeftRange.width, 0);
    var _c = getReactGridOffsets(state), top = _c.top, left = _c.left;
    var visibleColumns = cellMatrix.scrollableRange.columns.filter(function (col) { return col.right >= scrollLeft - left && col.left <= visibleScrollableAreaWidth + getStickyOffset(scrollLeft, left); });
    var visibleRows = cellMatrix.scrollableRange.rows.filter(function (row) { return row.bottom >= scrollTop - top && row.top <= visibleScrollableAreaHeight + getStickyOffset(scrollTop, top); });
    var visibleRange = new Range(visibleRows, visibleColumns);
    return __assign(__assign({}, state), { minScrollLeft: visibleRange.first.column === undefined ? 0 : visibleRange.first.column.left + left, maxScrollLeft: visibleRange.last.column === undefined ? 0 : visibleRange.last.column.right - visibleScrollableAreaWidth + left, minScrollTop: visibleRows.length > 0 ? visibleRange.first.row.top + top : 0, maxScrollTop: visibleColumns.length > 0 ? (visibleRange.last.row === undefined ? 0 : visibleRange.last.row.bottom - visibleScrollableAreaHeight + top) : 0, visibleRange: visibleRange });
}
