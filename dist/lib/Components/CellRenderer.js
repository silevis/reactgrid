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
    var _a = getCompatibleCellAndTemplate(props.state, props.location), cell = _a.cell, cellTemplate = _a.cellTemplate;
    var state = __assign({}, props.state);
    var location = props.location;
    var isFocused = state.focusedLocation !== undefined && (state.focusedLocation.column.idx === props.location.column.idx && state.focusedLocation.row.idx === props.location.row.idx);
    var customClass = cellTemplate.getClassName ? cellTemplate.getClassName(cell, false) : '';
    var style = __assign(__assign(__assign({}, (cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {}))), cell.style), { left: location.column.left, top: location.row.top, width: location.column.width, height: location.row.height, touchAction: (isFocused || cell.type === 'header') ? 'none' : 'auto' });
    return (React.createElement("div", { className: "rg-cell rg-" + cell.type + "-cell " + customClass, style: style, "data-cell-colidx": location.column.idx, "data-cell-rowidx": location.row.idx }, cellTemplate.render(cell, false, function (cell, commit) {
        if (!commit)
            throw new Error('commit should be set to true in this case.');
        props.state.update(function (state) { return tryAppendChange(state, location, cell); });
    })));
};
