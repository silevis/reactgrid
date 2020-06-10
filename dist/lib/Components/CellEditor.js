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
import * as React from 'react';
import { tryAppendChange } from '../Functions';
import { getScrollOfScrollableElement, getTopScrollableElement } from './../Functions/scrollHelpers';
import { getStickyOffset, getReactGridOffsets } from '../Functions/elementSizeHelpers';
export var CellEditorRenderer = function (props) {
    var state = props.state, positionCalculator = props.positionCalculator;
    var currentlyEditedCell = state.currentlyEditedCell;
    var location = state.focusedLocation;
    var _a = React.useReducer(positionCalculator, { state: state, location: location }), position = _a[0], dispatch = _a[1];
    React.useLayoutEffect(function () { return dispatch(); }, []);
    if (!currentlyEditedCell) {
        return null;
    }
    var cellTemplate = state.cellTemplates[currentlyEditedCell.type];
    return React.createElement(CellEditor, { cellType: currentlyEditedCell.type, style: {
            top: position.top && position.top - 1,
            left: position.left && position.left - 1,
            height: location.row.height + 1,
            width: location.column.width + 1,
            position: 'fixed'
        } }, cellTemplate.render(state.currentlyEditedCell, true, function (cell, commit) {
        state.currentlyEditedCell = commit ? undefined : cell;
        if (commit)
            state.update(function (state) { return tryAppendChange(state, location, cell); });
    }));
};
var CellEditor = function (props) {
    var style = props.style, cellType = props.cellType, children = props.children;
    return (React.createElement("div", { className: "rg-celleditor rg-" + cellType + "-celleditor", "data-cy": "rg-celleditor", style: __assign({}, style) }, children));
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
    if (location.column.idx > (cellMatrix.ranges.stickyLeftRange.last.column ? cellMatrix.ranges.stickyLeftRange.last.column.idx : cellMatrix.first.column.idx) || location.column.idx === cellMatrix.last.column.idx) {
        return cellMatrix.ranges.stickyLeftRange.width;
    }
}
export function getStickyTopRangeWidth(cellMatrix, location) {
    if (location.row.idx > (cellMatrix.ranges.stickyTopRange.last.row ? cellMatrix.ranges.stickyTopRange.last.row.idx : cellMatrix.first.row.idx) || location.row.idx === cellMatrix.last.row.idx) {
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
