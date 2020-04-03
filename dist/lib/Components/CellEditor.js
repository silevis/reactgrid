import * as React from 'react';
import { tryAppendChange, getTopScrollableElement, getScrollOfScrollableElement } from '../Functions';
import { getReactGridOffsets, getStickyOffset, getOffsetsOfElement } from '../Functions/elementSizeHelpers';
export var CellEditor = function (props) {
    var location = props.state.focusedLocation;
    var currentlyEditedCell = props.state.currentlyEditedCell;
    var _a = React.useReducer(positionReducer, { state: props.state, location: location }), position = _a[0], dispatch = _a[1];
    React.useEffect(function () { return dispatch(); }, []);
    if (!currentlyEditedCell) {
        return null;
    }
    var cellTemplate = props.state.cellTemplates[currentlyEditedCell.type];
    return (React.createElement("div", { className: "rg-celleditor rg-" + currentlyEditedCell.type + "-celleditor", "data-cy": "rg-celleditor", style: {
            top: position.top && (position.top + (props.state.disableFloatingCellEditor ? 0 : -1)),
            left: position.left && (position.left + (props.state.disableFloatingCellEditor ? 0 : -1)),
            height: location.row.height + 1,
            width: location.column.width + 1,
            position: props.state.disableFloatingCellEditor ? 'absolute' : 'fixed',
        } }, cellTemplate.render(props.state.currentlyEditedCell, true, function (cell, commit) {
        props.state.currentlyEditedCell = commit ? undefined : cell;
        if (commit)
            props.state.update(function (state) { return tryAppendChange(state, location, cell); });
    })));
};
var calculatedXAxisOffset = function (location, state) {
    var cellMatrix = state.cellMatrix;
    var scrollLeft = getScrollOfScrollableElement(state.scrollableElement).scrollLeft;
    var left = getReactGridOffsets(state).left;
    var leftStickyOffset = getStickyOffset(scrollLeft, left);
    if (location.column.idx > (cellMatrix.stickyLeftRange.last.column ? cellMatrix.stickyLeftRange.last.column.idx : cellMatrix.first.column.idx) || location.column.idx === cellMatrix.last.column.idx) {
        return cellMatrix.stickyLeftRange.width;
    }
    else if (cellMatrix.stickyLeftRange.first.column && location.column.idx >= cellMatrix.stickyLeftRange.first.column.idx && location.column.idx <= cellMatrix.stickyLeftRange.last.column.idx) {
        return leftStickyOffset;
    }
    return 0;
};
var calculatedYAxisOffset = function (location, state) {
    var cellMatrix = state.cellMatrix;
    var scrollTop = getScrollOfScrollableElement(state.scrollableElement).scrollTop;
    var top = getReactGridOffsets(state).top;
    var topStickyOffset = getStickyOffset(scrollTop, top);
    if (location.row.idx > (cellMatrix.stickyTopRange.last.row ? cellMatrix.stickyTopRange.last.row.idx : cellMatrix.first.row.idx) || location.row.idx === cellMatrix.last.row.idx) {
        return cellMatrix.stickyTopRange.height;
    }
    else if (cellMatrix.stickyTopRange.first.row && location.row.idx >= cellMatrix.stickyTopRange.first.row.idx && location.row.idx <= cellMatrix.stickyTopRange.last.row.idx) {
        return topStickyOffset;
    }
    return 0;
};
var calculatedEditorPosition = function (location, state) {
    var _a = getOffsetsOfElement(state.scrollableElement), offsetTop = _a.offsetTop, offsetLeft = _a.offsetLeft;
    var _b = getScrollOfScrollableElement(state.scrollableElement), scrollTop = _b.scrollTop, scrollLeft = _b.scrollLeft;
    var _c = getReactGridOffsets(state), top = _c.top, left = _c.left;
    var topScrollableElement = getTopScrollableElement();
    var windowScrollY = state.scrollableElement !== topScrollableElement ? topScrollableElement.scrollY : 0;
    var windowScrollX = state.scrollableElement !== topScrollableElement ? topScrollableElement.scrollX : 0;
    return {
        left: location.column.left + calculatedXAxisOffset(location, state) + offsetLeft - windowScrollX + left - scrollLeft,
        top: location.row.top + calculatedYAxisOffset(location, state) + offsetTop - windowScrollY + top - scrollTop
    };
};
var positionReducer = function (options) {
    return calculatedEditorPosition(options.location, options.state);
};
