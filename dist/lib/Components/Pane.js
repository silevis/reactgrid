var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Range } from '../Model';
import { CellFocus } from './CellFocus';
import { RowRenderer } from './RowRenderer';
var PaneGridContent = (function (_super) {
    __extends(PaneGridContent, _super);
    function PaneGridContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PaneGridContent.prototype.shouldComponentUpdate = function (nextProps) {
        var state = this.props.state;
        if (state.focusedLocation && nextProps.state.focusedLocation) {
            if (state.focusedLocation.column.columnId !== nextProps.state.focusedLocation.column.columnId || state.focusedLocation.row.rowId !== nextProps.state.focusedLocation.row.rowId)
                return true;
        }
        else {
            return true;
        }
        return state.visibleRange !== nextProps.state.visibleRange || state.cellMatrix.props !== nextProps.state.cellMatrix.props;
    };
    PaneGridContent.prototype.render = function () {
        var _a = this.props, range = _a.range, state = _a.state, borders = _a.borders, cellRenderer = _a.cellRenderer;
        return (React.createElement(React.Fragment, null,
            range.rows.map(function (row) { return React.createElement(RowRenderer, { key: row.rowId, state: state, row: row, columns: range.columns, forceUpdate: true, cellRenderer: cellRenderer, borders: __assign(__assign({}, borders), { top: borders.top && row.top === 0, bottom: borders.bottom && row.idx === range.last.row.idx }) }); }),
            range.rows.map(function (row) { return React.createElement("div", { key: row.rowId, className: "rg-separator-line rg-separator-line-row", style: { top: row.top, height: row.height, } }); }),
            range.columns.map(function (col) { return React.createElement("div", { key: col.columnId, className: "rg-separator-line rg-separator-line-col", style: { left: col.left, width: col.width } }); })));
    };
    return PaneGridContent;
}(React.Component));
function renderHighlights(state, range) {
    return state.highlightLocations.map(function (highlight, id) {
        var location = state.cellMatrix.getLocationById(highlight.rowId, highlight.columnId);
        return location && range.contains(location) &&
            React.createElement(CellFocus, { key: id, location: location, borderColor: highlight.borderColor, isHighlight: true });
    });
}
export var Pane = function (props) {
    var className = props.className, style = props.style, renderChildren = props.renderChildren, children = props.children;
    if (!style.width || !style.height) {
        return null;
    }
    else {
        return React.createElement(PaneContentWrapper, { className: className, style: style },
            " ",
            renderChildren && children,
            " ");
    }
};
export var PaneContent = function (props) {
    var state = props.state, range = props.range, rangeToSlice = props.rangeToSlice, direction = props.direction, borders = props.borders, cellRenderer = props.cellRenderer, children = props.children;
    if (!(range instanceof Range) || !(rangeToSlice instanceof Range)) {
        return null;
    }
    var calculatedRange = range.slice(rangeToSlice, direction);
    var childProps = {
        state: state,
        calculatedRange: calculatedRange
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(PaneGridContent, { state: state, range: calculatedRange, borders: borders, cellRenderer: cellRenderer }),
        renderHighlights(state, calculatedRange),
        state.focusedLocation && calculatedRange.contains(state.focusedLocation) &&
            React.createElement(CellFocus, { location: state.focusedLocation }),
        children && React.Children.toArray(children).map(function (element) {
            return React.cloneElement(element, childProps);
        })));
};
var PaneContentWrapper = function (props) {
    return React.createElement("div", { className: "rg-pane " + props.className, style: __assign({}, props.style) },
        " ",
        props.children,
        " ");
};
