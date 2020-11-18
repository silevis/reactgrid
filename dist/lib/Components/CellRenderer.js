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
import { areLocationsEqual } from '../Functions/areLocationsEqual';
import { noBorder } from '../Functions/excludeObjectProperties';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { tryAppendChange } from '../Functions/tryAppendChange';
import { isMobileDevice } from '../Functions/isMobileDevice';
var unset = 'unset';
function storeBorderAndCell(borders, cell) {
    return function (property, defaultProp) {
        return function (borderEdge) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (borders[borderEdge]) {
                return ((_c = (_b = (_a = cell.style) === null || _a === void 0 ? void 0 : _a.border) === null || _b === void 0 ? void 0 : _b[borderEdge]) === null || _c === void 0 ? void 0 : _c[property]) ? (_d = cell.style.border[borderEdge]) === null || _d === void 0 ? void 0 : _d[property] : defaultProp;
            }
            else if ((_g = (_f = (_e = cell.style) === null || _e === void 0 ? void 0 : _e.border) === null || _f === void 0 ? void 0 : _f[borderEdge]) === null || _g === void 0 ? void 0 : _g[property]) {
                return (_h = cell.style.border[borderEdge]) === null || _h === void 0 ? void 0 : _h[property];
            }
            return unset;
        };
    };
}
function getBorderProperties(getPropertyOnBorderFn) {
    return {
        left: getPropertyOnBorderFn('left'),
        right: getPropertyOnBorderFn('right'),
        top: getPropertyOnBorderFn('top'),
        bottom: getPropertyOnBorderFn('bottom'),
    };
}
export var CellRenderer = function (_a) {
    var _b;
    var state = _a.state, location = _a.location, children = _a.children, borders = _a.borders;
    var _c = getCompatibleCellAndTemplate(state, location), cell = _c.cell, cellTemplate = _c.cellTemplate;
    var isFocused = state.focusedLocation !== undefined && areLocationsEqual(state.focusedLocation, location);
    var customClass = (_b = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false))) !== null && _b !== void 0 ? _b : '';
    var storePropertyAndDefaultValue = storeBorderAndCell(borders, cell);
    var bordersColor = getBorderProperties(storePropertyAndDefaultValue('color', '#E8E8E8')), bordersWidth = getBorderProperties(storePropertyAndDefaultValue('width', '1px')), bordersStyle = getBorderProperties(storePropertyAndDefaultValue('style', 'solid'));
    var bordersProps = {
        borderLeft: bordersWidth.left === unset && bordersStyle.left === unset && bordersColor.left === unset ? unset
            : bordersWidth.left + " " + bordersStyle.left + " " + bordersColor.left,
        borderRight: bordersWidth.right === unset && bordersStyle.right === unset && bordersColor.right === unset ? unset
            : bordersWidth.right + " " + bordersStyle.right + " " + bordersColor.right,
        borderTop: bordersWidth.top === unset && bordersStyle.top === unset && bordersColor.top === unset ? unset
            : bordersWidth.top + " " + bordersStyle.top + " " + bordersColor.top,
        borderBottom: bordersWidth.bottom === unset && bordersStyle.bottom === unset && bordersColor.bottom === unset ? unset
            : bordersWidth.bottom + " " + bordersStyle.bottom + " " + bordersColor.bottom,
    };
    var isMobile = isMobileDevice();
    var style = __assign(__assign(__assign(__assign(__assign({}, (cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {}))), (cell.style && noBorder(cell.style))), { left: location.column.left, top: location.row.top, width: location.column.width, height: location.row.height }), (!(isFocused && state.currentlyEditedCell) && bordersProps)), ((isFocused || cell.type === 'header') && { touchAction: 'none' }) // prevent scrolling
    );
    var isInEditMode = isFocused && !!(state.currentlyEditedCell);
    var groupIdClassName = cell.groupId ? " rg-groupId-" + cell.groupId : '';
    var nonEditableClassName = cell.nonEditable ? ' rg-cell-nonEditable' : '';
    var cellClassNames = isInEditMode && isMobile ? " rg-celleditor rg-" + cell.type + "-celleditor" : " rg-" + cell.type + "-cell";
    var classNames = "rg-cell" + cellClassNames + groupIdClassName + nonEditableClassName + " " + customClass;
    var cellToRender = isFocused && state.currentlyEditedCell && isMobile ? state.currentlyEditedCell : cell;
    var onCellChanged = function (cell, commit) {
        if (isInEditMode) {
            state.currentlyEditedCell = commit ? undefined : cell;
            if (commit)
                state.update(function (state) { return tryAppendChange(state, location, cell); });
        }
        else {
            if (!commit)
                throw new Error('commit should be set to true in this case.');
            state.update(function (state) { return tryAppendChange(state, location, cell); });
        }
    };
    return (React.createElement("div", { className: classNames, style: style, "data-cell-colidx": process.env.NODE_ENV === "development" ? location.column.idx : null, "data-cell-rowidx": process.env.NODE_ENV === "development" ? location.row.idx : null },
        cellTemplate.render(cellToRender, isMobile ? isInEditMode : false, onCellChanged),
        children,
        state.enableGroupIdRender && (cell === null || cell === void 0 ? void 0 : cell.groupId) !== undefined && !(isInEditMode && isMobile) &&
            React.createElement("span", { className: 'rg-groupId' }, cell.groupId)));
};
