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
import { getSizeOfElement } from './elementSizeHelpers';
import { CellMatrix } from '../Model/CellMatrix';
var DEFAULT_BREAKPOINT = 50;
export function updateResponsiveSticky(props, state) {
    var _a = props.horizontalStickyBreakpoint, horizontalStickyBreakpoint = _a === void 0 ? DEFAULT_BREAKPOINT : _a, _b = props.verticalStickyBreakpoint, verticalStickyBreakpoint = _b === void 0 ? DEFAULT_BREAKPOINT : _b;
    var leftStickyColumns = props.stickyLeftColumns || 0;
    var topStickyRows = props.stickyTopRows || 0;
    if (props.stickyLeftColumns || props.stickyTopRows) {
        var _c = getSizeOfElement(state.scrollableElement), width = _c.width, height = _c.height;
        if (props.stickyLeftColumns) {
            var predictedLeftRangeWidth = props.columns.slice(0, leftStickyColumns).reduce(function (acc, column) {
                return acc + (column.width || CellMatrix.DEFAULT_COLUMN_WIDTH);
            }, 0);
            var shouldDisableStickyHorizontally = predictedLeftRangeWidth > (horizontalStickyBreakpoint * width / 100);
            leftStickyColumns = shouldDisableStickyHorizontally ? 0 : leftStickyColumns;
        }
        if (props.stickyTopRows) {
            var predictedTopRangeHeight = props.rows.slice(0, topStickyRows).reduce(function (acc, curr) {
                return acc + (curr.height || CellMatrix.DEFAULT_ROW_HEIGHT);
            }, 0);
            var shouldDisableStickyVertically = predictedTopRangeHeight > (verticalStickyBreakpoint * height / 100);
            topStickyRows = shouldDisableStickyVertically ? 0 : topStickyRows;
        }
    }
    return __assign(__assign({}, state), { leftStickyColumns: leftStickyColumns,
        topStickyRows: topStickyRows });
}
