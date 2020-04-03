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
import { CellEditor } from './CellEditor';
import { HiddenElement } from './HiddenElement';
import { isBrowserFirefox } from '../Functions';
import { Pane } from './Pane';
export var GridRenderer = function (props) {
    var state = props.state, eventHandlers = props.eventHandlers;
    var cellMatrix = state.cellMatrix;
    var renderTopSticky = cellMatrix.stickyTopRange.height > 0, renderMiddleRange = cellMatrix.scrollableRange.height > 0 && cellMatrix.scrollableRange.first.column &&
        cellMatrix.scrollableRange.first.row && cellMatrix.scrollableRange.last.row &&
        state.visibleRange && state.visibleRange.height > 0;
    var renderLeftSticky = cellMatrix.stickyLeftRange.width > 0, renderCenterRange = state.visibleRange && state.visibleRange.width > 0;
    var visibleScrollableRange = renderMiddleRange && cellMatrix.scrollableRange.slice(state.visibleRange, 'rows');
    return (React.createElement("div", { className: 'reactgrid', "data-cy": "reactgrid", style: {
            position: 'relative',
            width: cellMatrix.width,
            height: cellMatrix.height
        }, ref: eventHandlers.reactgridRefHandler },
        React.createElement("div", { className: "reactgrid-content", onKeyDown: eventHandlers.keyDownHandler, onKeyUp: eventHandlers.keyUpHandler, onPointerDown: eventHandlers.pointerDownHandler, onPasteCapture: eventHandlers.pasteCaptureHandler, onPaste: eventHandlers.pasteHandler, onCopy: eventHandlers.copyHandler, onCut: eventHandlers.cutHandler, "data-cy": "reactgrid-content", style: {
                width: cellMatrix.width,
                height: cellMatrix.height,
            } },
            React.createElement(Pane, { state: state, renderAsFrame: renderMiddleRange && renderCenterRange, className: 'rg-pane-center-middle', style: {
                    position: 'relative',
                    width: cellMatrix.scrollableRange.width,
                    height: cellMatrix.scrollableRange.height,
                    order: 3,
                }, range: function () { return visibleScrollableRange.slice(state.visibleRange, 'columns'); }, borders: { right: false, bottom: false } }),
            React.createElement(Pane, { state: state, renderAsFrame: renderMiddleRange && renderLeftSticky, className: 'rg-pane-left', style: __assign({ height: cellMatrix.scrollableRange.height, width: cellMatrix.width - cellMatrix.scrollableRange.width, order: 2 }, (isBrowserFirefox() && { zIndex: 1 })), range: function () { return cellMatrix.stickyLeftRange.slice(visibleScrollableRange, 'rows'); }, borders: { bottom: true, right: true } }),
            React.createElement(Pane, { state: state, renderAsFrame: renderTopSticky && renderCenterRange, className: 'rg-pane-top', style: __assign({ width: cellMatrix.scrollableRange.width, height: cellMatrix.stickyTopRange.height, order: 1 }, (isBrowserFirefox() && { zIndex: 1 })), range: function () { return cellMatrix.stickyTopRange.slice(state.visibleRange, 'columns'); }, borders: { right: false, bottom: false } }),
            React.createElement(Pane, { state: state, renderAsFrame: renderTopSticky && renderLeftSticky, className: 'rg-pane-top rg-pane-left', style: __assign({ height: cellMatrix.stickyTopRange.height, width: cellMatrix.width - cellMatrix.scrollableRange.width, order: 0 }, (isBrowserFirefox() && { zIndex: 2 })), range: function () { return cellMatrix.stickyLeftRange.slice(cellMatrix.stickyTopRange, 'rows'); }, borders: { bottom: true, right: true } }),
            React.createElement(HiddenElement, { hiddenElementRefHandler: eventHandlers.hiddenElementRefHandler, state: state }),
            state.currentlyEditedCell && React.createElement(CellEditor, { state: state }))));
};
