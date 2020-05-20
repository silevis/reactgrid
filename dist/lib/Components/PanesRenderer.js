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
import { Pane, PaneContent } from './Pane';
import { isBrowserFirefox } from '../Functions';
import { shouldRenderTopSticky, shouldRenderMiddleRange, shouldRenderLeftSticky, shouldRenderCenterRange } from '../Functions/paneRendererPredicates';
export var PanesRenderer = function (props) {
    var state = props.state, cellRenderer = props.cellRenderer;
    var cellMatrix = state.cellMatrix;
    var renderTopSticky = shouldRenderTopSticky(state), renderMiddleRange = shouldRenderMiddleRange(state), renderLeftSticky = shouldRenderLeftSticky(state), renderCenterRange = shouldRenderCenterRange(state);
    if (!renderTopSticky && !renderMiddleRange && !renderLeftSticky && !renderCenterRange) {
        return null;
    }
    var visibleScrollableRange = renderMiddleRange && cellMatrix.scrollableRange.slice(state.visibleRange, 'rows');
    return (React.createElement(React.Fragment, null,
        React.createElement(Pane, { renderChildren: renderMiddleRange && renderCenterRange, className: 'rg-pane-center-middle', style: {
                position: 'relative',
                width: cellMatrix.scrollableRange.width,
                height: cellMatrix.scrollableRange.height,
                order: 3,
            } },
            React.createElement(PaneContent, { state: state, range: visibleScrollableRange, rangeToSlice: state.visibleRange, direction: 'columns', borders: { right: false, bottom: false }, cellRenderer: cellRenderer })),
        React.createElement(Pane, { renderChildren: renderMiddleRange && renderLeftSticky, className: 'rg-pane-left', style: __assign({ height: cellMatrix.scrollableRange.height, width: cellMatrix.width - cellMatrix.scrollableRange.width, order: 2 }, (isBrowserFirefox() && { zIndex: 1 })) },
            React.createElement(PaneContent, { state: state, range: cellMatrix.ranges.stickyLeftRange, rangeToSlice: visibleScrollableRange, direction: 'rows', borders: { bottom: true, right: true }, cellRenderer: cellRenderer })),
        React.createElement(Pane, { renderChildren: renderTopSticky && renderCenterRange, className: 'rg-pane-top', style: __assign({ width: cellMatrix.scrollableRange.width, height: cellMatrix.ranges.stickyTopRange.height, order: 1 }, (isBrowserFirefox() && { zIndex: 1 })) },
            React.createElement(PaneContent, { state: state, range: cellMatrix.ranges.stickyTopRange, rangeToSlice: state.visibleRange, direction: 'columns', borders: { right: false, bottom: false }, cellRenderer: cellRenderer })),
        React.createElement(Pane, { renderChildren: renderTopSticky && renderLeftSticky, className: 'rg-pane-top rg-pane-left', style: __assign({ height: cellMatrix.ranges.stickyTopRange.height, width: cellMatrix.width - cellMatrix.scrollableRange.width, order: 0 }, (isBrowserFirefox() && { zIndex: 2 })) },
            React.createElement(PaneContent, { state: state, range: cellMatrix.ranges.stickyLeftRange, rangeToSlice: cellMatrix.ranges.stickyTopRange, direction: 'rows', borders: { bottom: true, right: true }, cellRenderer: cellRenderer }))));
};
