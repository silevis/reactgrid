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
import { recalcVisibleRange, focusLocation } from '.';
import { defaultCellTemplates } from './defaultCellTemplates';
import { CellMatrixBuilder } from '../Model/CellMatrixBuilder';
export function getDerivedStateFromProps(props, state) {
    var stateDeriverWithProps = stateDeriver(props);
    var hasHighlightsChanged = highlightsHasChanged(props, state);
    if (hasHighlightsChanged) {
        state = stateDeriverWithProps(state)(appendHighlights);
    }
    state = stateDeriverWithProps(state)(updateStateProps);
    state = stateDeriverWithProps(state)(appendCellTemplates);
    var hasChanged = dataHasChanged(props, state);
    if (hasChanged) {
        state = stateDeriverWithProps(state)(updateCellMatrix);
    }
    state = stateDeriverWithProps(state)(updateFocusedLocation);
    if (hasChanged) {
        state = stateDeriverWithProps(state)(updateVisibleRange);
    }
    state = stateDeriverWithProps(state)(setInitialFocusLocation);
    if (areFocusesDiff(props, state)) {
        state = stateDeriverWithProps(state)(setFocusLocation);
    }
    return state;
}
export var areFocusesDiff = function (props, state) {
    var _a, _b, _c, _d;
    return ((_a = props.focusLocation) === null || _a === void 0 ? void 0 : _a.columnId) !== ((_b = state.focusedLocation) === null || _b === void 0 ? void 0 : _b.column.columnId)
        || ((_c = props.focusLocation) === null || _c === void 0 ? void 0 : _c.rowId) !== ((_d = state.focusedLocation) === null || _d === void 0 ? void 0 : _d.row.rowId);
};
export var stateDeriver = function (props) { return function (state) { return function (fn) { return fn(props, state); }; }; };
export var dataHasChanged = function (props, state) { return !state.cellMatrix || props !== state.cellMatrix.props; };
export var highlightsHasChanged = function (props, state) { var _a; return props.highlights !== ((_a = state.props) === null || _a === void 0 ? void 0 : _a.highlights); };
export function updateStateProps(props, state) {
    if (state.props !== props) {
        state = __assign(__assign({}, state), { props: props });
    }
    return state;
}
function updateCellMatrix(props, state) {
    var builder = new CellMatrixBuilder();
    return __assign(__assign({}, state), { cellMatrix: builder.setProps(props).fillRowsAndCols().fillSticky().fillScrollableRange()
            .setEdgeLocations().getCellMatrix() });
}
export function updateFocusedLocation(props, state) {
    if (state.cellMatrix.columns.length > 0 && state.focusedLocation && !state.currentlyEditedCell) {
        state = __assign(__assign({}, state), { focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) });
    }
    return state;
}
function updateVisibleRange(props, state) {
    if (state.visibleRange) {
        state = recalcVisibleRange(state);
    }
    return state;
}
export function appendCellTemplates(props, state) {
    return __assign(__assign({}, state), { cellTemplates: __assign(__assign({}, defaultCellTemplates), props.customCellTemplates) });
}
export function appendHighlights(props, state) {
    var _a, _b;
    var highlights = (_a = props.highlights) === null || _a === void 0 ? void 0 : _a.filter(function (highlight) { return state.cellMatrix.rowIndexLookup[highlight.rowId] !== undefined &&
        state.cellMatrix.columnIndexLookup[highlight.columnId] !== undefined; });
    if ((highlights === null || highlights === void 0 ? void 0 : highlights.length) !== ((_b = props.highlights) === null || _b === void 0 ? void 0 : _b.length)) {
        console.error('Data inconsistency in ReactGrid "highlights" prop');
    }
    return __assign(__assign({}, state), { highlightLocations: highlights || [] });
}
export function setInitialFocusLocation(props, state) {
    var locationToFocus = props.initialFocusLocation;
    if (locationToFocus && !state.focusedLocation) {
        if (!(state.cellMatrix.columnIndexLookup[locationToFocus.columnId] !== undefined) || !(state.cellMatrix.rowIndexLookup[locationToFocus.rowId] !== undefined)) {
            console.error('Data inconsistency in ReactGrid "initialFocusLocation" prop');
            return state;
        }
        return focusLocation(state, state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId));
    }
    return state;
}
export function setFocusLocation(props, state) {
    var locationToFocus = props.focusLocation;
    if (locationToFocus) {
        if (!(state.cellMatrix.columnIndexLookup[locationToFocus.columnId] !== undefined) || !(state.cellMatrix.rowIndexLookup[locationToFocus.rowId] !== undefined)) {
            console.error('Data inconsistency in ReactGrid "focusLocation" prop');
            return state;
        }
        var location_1 = state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId);
        return focusLocation(state, location_1);
    }
    return state;
}
