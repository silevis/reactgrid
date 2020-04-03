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
    var cellMatrix = state.cellMatrix;
    var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
    var top = getReactGridOffsets(state).top;
    var topStickyOffset = getStickyOffset(scrollTop, top);
    if (cellMatrix.stickyTopRange.rows.find(function (row) { return row.bottom > viewportY - topStickyOffset; }) && viewportY < cellMatrix.stickyTopRange.height + topStickyOffset && !(favorScrollableContent && scrollTop > top)) {
        var row = cellMatrix.stickyTopRange.rows.find(function (row) { return row.bottom > viewportY - topStickyOffset; });
        var cellY = viewportY - row.top;
        return { cellY: cellY, row: row };
    }
    else {
        var scrollableContentY_1 = viewportY - cellMatrix.stickyTopRange.height;
        var row = cellMatrix.scrollableRange.rows.find(function (row) { return row.bottom >= scrollableContentY_1; }) || cellMatrix.scrollableRange.last.row;
        var cellY = scrollableContentY_1 - row.top;
        return { cellY: cellY, row: row };
    }
}
function getColumn(state, viewportX, favorScrollableContent) {
    var cellMatrix = state.cellMatrix;
    var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
    var left = getReactGridOffsets(state).left;
    var leftStickyOffset = getStickyOffset(scrollLeft, left);
    if (cellMatrix.stickyLeftRange.columns.find(function (column) { return column.right > viewportX - leftStickyOffset; }) && viewportX < cellMatrix.stickyLeftRange.height + leftStickyOffset && !(favorScrollableContent && scrollLeft > left)) {
        var column = cellMatrix.stickyLeftRange.columns.find(function (column) { return column.right > viewportX - leftStickyOffset; });
        var cellX = viewportX - column.left;
        return { cellX: cellX, column: column };
    }
    else {
        var scrollableContentX_1 = viewportX - cellMatrix.stickyLeftRange.width;
        var column = cellMatrix.scrollableRange.columns.find(function (column) { return column.right >= scrollableContentX_1; }) || cellMatrix.scrollableRange.last.column;
        var cellX = scrollableContentX_1 - column.left;
        return { cellX: cellX, column: column };
    }
}
