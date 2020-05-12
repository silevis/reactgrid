import { getScrollOfScrollableElement } from './scrollHelpers';
import { getReactGridOffsets, getStickyOffset } from './elementSizeHelpers';
export function getLocationFromClient(state, clientX, clientY, favorScrollableContent) {
    var _a = state.reactGridElement.getBoundingClientRect(), left = _a.left, top = _a.top;
    var viewportX = clientX - left;
    var viewportY = clientY - top;
    var _b = getRow(state, viewportY, favorScrollableContent === 'vertical' || favorScrollableContent === 'both'), cellY = _b.cellY, row = _b.row;
    var _c = getColumn(state, viewportX, favorScrollableContent === 'horizontal' || favorScrollableContent === 'both'), cellX = _c.cellX, column = _c.column;
    return { row: row, column: column, viewportX: viewportX, viewportY: viewportY, cellX: cellX, cellY: cellY };
}
function getRow(state, viewportY, favorScrollableContent) {
    var result = getStickyTopRow(state, viewportY, favorScrollableContent) || getScrollableContentRow(state, viewportY);
    return result;
}
function getColumn(state, viewportX, favorScrollableContent) {
    var result = getLeftStickyColumn(state, viewportX, favorScrollableContent) || getScrollableContentColumn(state, viewportX);
    return result;
}
export function getStickyTopRow(state, viewportY, favorScrollableContent) {
    var cellMatrix = state.cellMatrix;
    var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
    var top = getReactGridOffsets(state).top;
    var topStickyOffset = getStickyOffset(scrollTop, top);
    if (cellMatrix.ranges.stickyTopRange.rows.find(function (row) { return row.bottom > viewportY - topStickyOffset; }) && viewportY < cellMatrix.ranges.stickyTopRange.height + topStickyOffset && !(favorScrollableContent && scrollTop > top)) {
        var row = cellMatrix.ranges.stickyTopRange.rows.find(function (row) { return row.bottom > viewportY - topStickyOffset; });
        var cellY = viewportY - row.top;
        return { cellY: cellY, row: row };
    }
}
export function getLeftStickyColumn(state, viewportX, favorScrollableContent) {
    var cellMatrix = state.cellMatrix;
    var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
    var left = getReactGridOffsets(state).left;
    var leftStickyOffset = getStickyOffset(scrollLeft, left);
    if (cellMatrix.ranges.stickyLeftRange.columns.find(function (column) { return column.right > viewportX - leftStickyOffset; }) && viewportX < cellMatrix.ranges.stickyLeftRange.height + leftStickyOffset && !(favorScrollableContent && scrollLeft > left)) {
        var column = cellMatrix.ranges.stickyLeftRange.columns.find(function (column) { return column.right > viewportX - leftStickyOffset; });
        var cellX = viewportX - column.left;
        return { cellX: cellX, column: column };
    }
}
export function getScrollableContentRow(state, viewportY) {
    var cellMatrix = state.cellMatrix;
    var scrollableContentY = viewportY - cellMatrix.ranges.stickyTopRange.height;
    var row = cellMatrix.scrollableRange.rows.find(function (row) { return row.bottom >= scrollableContentY; }) || cellMatrix.scrollableRange.last.row;
    var cellY = scrollableContentY - row.top;
    return { cellY: cellY, row: row };
}
export function getScrollableContentColumn(state, viewportX) {
    var cellMatrix = state.cellMatrix;
    var scrollableContentX = viewportX - cellMatrix.ranges.stickyLeftRange.width;
    var column = cellMatrix.scrollableRange.columns.find(function (column) { return column.right >= scrollableContentX; }) || cellMatrix.scrollableRange.last.column;
    var cellX = scrollableContentX - column.left;
    return { cellX: cellX, column: column };
}
