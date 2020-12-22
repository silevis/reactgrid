import * as React from 'react';
import { getReactGridOffsets, getStickyOffset } from '../Functions/elementSizeHelpers';
import { getScrollOfScrollableElement, getTopScrollableElement } from '../Functions/scrollHelpers';
import { tryAppendChange } from '../Functions/tryAppendChange';
export var CellEditorRenderer = function (_a) {
    var state = _a.state, positionCalculator = _a.positionCalculator;
    var currentlyEditedCell = state.currentlyEditedCell;
    var location = state.focusedLocation;
    var _b = React.useReducer(positionCalculator, { state: state, location: location }), position = _b[0], dispatch = _b[1]; // used to lock cell editor position
    React.useLayoutEffect(function () { return dispatch(); }, []);
    if (!currentlyEditedCell) { // prevents to unexpectly opening cell editor on cypress
        return null;
    }
    var cellTemplate = state.cellTemplates[currentlyEditedCell.type];
    return React.createElement(CellEditor, { cellType: currentlyEditedCell.type, style: {
            top: position.top && position.top - 1,
            left: position.left && position.left - 1,
            height: location.row.height + 1,
            width: location.column.width + 1,
            position: 'fixed'
        } }, cellTemplate.render(currentlyEditedCell, true, function (cell, commit) {
        state.currentlyEditedCell = commit ? undefined : cell;
        if (commit)
            state.update(function (state) { return tryAppendChange(state, location, cell); });
    }));
};
var CellEditor = function (_a) {
    var style = _a.style, cellType = _a.cellType, children = _a.children;
    return (React.createElement("div", { className: "rg-celleditor rg-" + cellType + "-celleditor", style: style }, children));
};
var calculatedXAxisOffset = function (location, state) {
    var cellMatrix = state.cellMatrix;
    var offset = getStickyLeftRangeWidth(cellMatrix, location) || getLeftStickyOffset(cellMatrix, location, state);
    if (offset) {
        return offset;
    }
    return 0;
};
var calculatedYAxisOffset = function (location, state) {
    var cellMatrix = state.cellMatrix;
    var offset = getStickyTopRangeWidth(cellMatrix, location) || getTopStickyOffset(cellMatrix, location, state);
    if (offset) {
        return offset;
    }
    return 0;
};
export function getStickyLeftRangeWidth(cellMatrix, location) {
    var _a;
    if (location.column.idx > (cellMatrix.ranges.stickyLeftRange.last.column ? cellMatrix.ranges.stickyLeftRange.last.column.idx : cellMatrix.first.column.idx)
        || (location.column.idx === cellMatrix.last.column.idx && location.column.idx !== ((_a = cellMatrix.ranges.stickyLeftRange.last.column) === null || _a === void 0 ? void 0 : _a.idx))) {
        return cellMatrix.ranges.stickyLeftRange.width;
    }
}
export function getStickyTopRangeWidth(cellMatrix, location) {
    var _a;
    if (location.row.idx > (cellMatrix.ranges.stickyTopRange.last.row ? cellMatrix.ranges.stickyTopRange.last.row.idx : cellMatrix.first.row.idx)
        || (location.row.idx === cellMatrix.last.row.idx && location.row.idx !== ((_a = cellMatrix.ranges.stickyTopRange.last.row) === null || _a === void 0 ? void 0 : _a.idx))) {
        return cellMatrix.ranges.stickyTopRange.height;
    }
}
export function getLeftStickyOffset(cellMatrix, location, state) {
    if (cellMatrix.ranges.stickyLeftRange.first.column && location.column.idx >= cellMatrix.ranges.stickyLeftRange.first.column.idx
        && location.column.idx <= cellMatrix.ranges.stickyLeftRange.last.column.idx) {
        var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
        var left = getReactGridOffsets(state).left;
        var leftStickyOffset = getStickyOffset(scrollLeft, left);
        return leftStickyOffset;
    }
}
export function getTopStickyOffset(cellMatrix, location, state) {
    if (cellMatrix.ranges.stickyTopRange.first.row && location.row.idx >= cellMatrix.ranges.stickyTopRange.first.row.idx
        && location.row.idx <= cellMatrix.ranges.stickyTopRange.last.row.idx) {
        var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
        var top_1 = getReactGridOffsets(state).top;
        var topStickyOffset = getStickyOffset(scrollTop, top_1);
        return topStickyOffset;
    }
}
export var cellEditorCalculator = function (options) {
    var state = options.state, location = options.location;
    var _a = getScrollOfScrollableElement(state.scrollableElement), scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
    var _b = getReactGridOffsets(state), top = _b.top, left = _b.left;
    var offsetLeft = 0, offsetTop = 0;
    if (state.scrollableElement !== getTopScrollableElement()) {
        var _c = state.scrollableElement.getBoundingClientRect(), left_1 = _c.left, top_2 = _c.top;
        offsetLeft = left_1;
        offsetTop = top_2;
    }
    return {
        left: location.column.left + calculatedXAxisOffset(location, state)
            + offsetLeft
            + left
            - scrollLeft,
        top: location.row.top + calculatedYAxisOffset(location, state)
            + offsetTop
            + top
            - scrollTop
    };
};
