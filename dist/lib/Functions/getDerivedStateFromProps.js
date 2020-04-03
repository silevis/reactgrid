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
import { CellMatrix } from '../Model';
import { recalcVisibleRange } from '.';
import { defaultCellTemplates } from './defaultCellTemplates';
import { setInitialFocusLocation } from './setInitialFocusLocation';
export function getDerivedStateFromProps(props, state) {
    var _a;
    if (state.props !== props) {
        state = __assign(__assign({}, state), { props: props });
    }
    var dataHasChanged = !state.cellMatrix || props !== state.cellMatrix.props;
    if (dataHasChanged) {
        state = __assign(__assign({}, state), { cellMatrix: new CellMatrix(props) });
    }
    if (!state.currentlyEditedCell && state.focusedLocation && state.cellMatrix.columns.length > 0 && dataHasChanged) {
        state = __assign(__assign({}, state), { focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) });
    }
    if (state.visibleRange && dataHasChanged) {
        state = recalcVisibleRange(state);
    }
    state = setInitialFocusLocation(state, props.focusLocation);
    return __assign(__assign({}, state), { highlightLocations: (_a = props.highlights) !== null && _a !== void 0 ? _a : [], cellTemplates: __assign(__assign({}, defaultCellTemplates), props.customCellTemplates) });
}
