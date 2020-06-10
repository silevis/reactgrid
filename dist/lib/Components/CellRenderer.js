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
export var CellRenderer = function (props) {
    var _a;
    var state = props.state, location = props.location, children = props.children;
    var _b = getCompatibleCellAndTemplate(state, location), cell = _b.cell, cellTemplate = _b.cellTemplate;
    var isFocused = state.focusedLocation !== undefined && (state.focusedLocation.column.idx === location.column.idx &&
        state.focusedLocation.row.idx === location.row.idx);
    var customClass = (_a = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false))) !== null && _a !== void 0 ? _a : '';
    var style = __assign(__assign(__assign(__assign({}, (cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {}))), cell.style), { left: location.column.left, top: location.row.top, width: location.column.width, height: location.row.height }), ((isFocused || cell.type === 'header') && { touchAction: 'none' }));
    return (React.createElement("div", { className: "rg-cell rg-" + cell.type + "-cell " + customClass, style: style, "data-cell-colidx": location.column.idx, "data-cell-rowidx": location.row.idx },
        cellTemplate.render(cell, false, function (cell, commit) {
            if (!commit)
                throw new Error('commit should be set to true in this case.');
            state.update(function (state) { return tryAppendChange(state, location, cell); });
        }),
        children));
};
