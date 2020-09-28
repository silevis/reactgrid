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
import { CellFocus } from './CellFocus';
import { RowRenderer } from './RowRenderer';
function shouldMemoPaneGridContent(prevProps, nextProps) {
    var prevState = prevProps.state;
    var nextState = nextProps.state;
    if (prevState.focusedLocation && nextState.focusedLocation) {
        if (prevState.focusedLocation.column.columnId !== nextState.focusedLocation.column.columnId
            || prevState.focusedLocation.row.rowId !== nextState.focusedLocation.row.rowId)
            return false;
    }
    else {
        return false;
    }
    return !(prevState.visibleRange !== nextState.visibleRange || prevState.cellMatrix.props !== nextState.cellMatrix.props);
}
export var PaneGridContent = React.memo(function (_a) {
    var range = _a.range, state = _a.state, borders = _a.borders, cellRenderer = _a.cellRenderer;
    return React.createElement(React.Fragment, null, range.rows.map(function (row) { return React.createElement(RowRenderer, { key: row.rowId, state: state, row: row, columns: range.columns, forceUpdate: true, cellRenderer: cellRenderer, borders: __assign(__assign({}, borders), { top: borders.top && row.top === 0, bottom: (borders.bottom && row.idx === range.last.row.idx) || !(state.cellMatrix.scrollableRange.last.row.idx === row.idx) }) }); }));
}, shouldMemoPaneGridContent);
function renderHighlights(state, range) {
    return state.highlightLocations.map(function (highlight, id) {
        try {
            var location_1 = state.cellMatrix.getLocationById(highlight.rowId, highlight.columnId);
            return location_1 && range.contains(location_1) &&
                React.createElement(CellFocus, { key: id, location: location_1, borderColor: highlight.borderColor, isHighlight: true });
        }
        catch (error) {
            console.error("Cell location fot found while rendering highlights at: " + error.message);
            return null;
        }
    });
}
export var Pane = function (_a) {
    var className = _a.className, style = _a.style, renderChildren = _a.renderChildren, children = _a.children;
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
    var state = props.state, range = props.range, borders = props.borders, cellRenderer = props.cellRenderer, children = props.children;
    var calculatedRange = range();
    return (React.createElement(React.Fragment, null,
        React.createElement(PaneGridContent, { state: state, range: calculatedRange, borders: borders, cellRenderer: cellRenderer }),
        renderHighlights(state, calculatedRange),
        state.focusedLocation && calculatedRange.contains(state.focusedLocation) &&
            React.createElement(CellFocus, { location: state.focusedLocation }),
        children && children(state, calculatedRange)));
};
var PaneContentWrapper = function (props) {
    return React.createElement("div", { className: "rg-pane " + props.className, style: props.style },
        " ",
        props.children,
        " ");
};
