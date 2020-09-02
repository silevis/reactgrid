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
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
export var CellRenderer = function (_a) {
    var _b;
    var state = _a.state, location = _a.location, children = _a.children;
    var _c = getCompatibleCellAndTemplate(state, location), cell = _c.cell, cellTemplate = _c.cellTemplate;
    var isFocused = state.focusedLocation !== undefined && (state.focusedLocation.column.idx === location.column.idx &&
        state.focusedLocation.row.idx === location.row.idx);
    var customClass = (_b = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false))) !== null && _b !== void 0 ? _b : '';
    var style = __assign(__assign(__assign(__assign({}, (cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {}))), cell.style), { left: location.column.left, top: location.row.top, width: location.column.width, height: location.row.height }), ((isFocused || cell.type === 'header') && { touchAction: 'none' }));
    return (React.createElement("div", { className: "rg-cell rg-" + cell.type + "-cell " + (cell.groupId ? "rg-groupId-" + cell.groupId : '') + " " + customClass, style: style, "data-cell-colidx": location.column.idx, "data-cell-rowidx": location.row.idx },
        cellTemplate.render(cell, false, function (cell, commit) {
            if (!commit)
                throw new Error('commit should be set to true in this case.');
            state.update(function (state) { return tryAppendChange(state, location, cell); });
        }),
        children,
        state.enableGroupIdRender && (cell === null || cell === void 0 ? void 0 : cell.groupId) !== undefined &&
            React.createElement("span", { className: 'rg-groupId' }, cell.groupId)));
};
