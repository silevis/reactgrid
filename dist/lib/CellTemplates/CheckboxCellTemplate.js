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
import { keyCodes } from '../Functions/keyCodes';
import { getCellProperty } from '../Functions/getCellProperty';
var CheckboxCellTemplate = (function () {
    function CheckboxCellTemplate() {
    }
    CheckboxCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var checked = getCellProperty(uncertainCell, 'checked', 'boolean');
        var text = checked ?
            uncertainCell.checkedText ? uncertainCell.checkedText : '1' :
            uncertainCell.uncheckedText ? uncertainCell.uncheckedText : '';
        return __assign(__assign({}, uncertainCell), { checked: checked, value: checked ? 1 : NaN, text: text });
    };
    CheckboxCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if (!shift && (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER))
            return { cell: this.getCompatibleCell(this.toggleCheckboxCell(cell)), enableEditMode: false };
        return { cell: cell, enableEditMode: false };
    };
    CheckboxCellTemplate.prototype.toggleCheckboxCell = function (cell) {
        return this.getCompatibleCell(__assign(__assign({}, cell), { checked: !cell.checked }));
    };
    CheckboxCellTemplate.prototype.update = function (cell, cellToMerge) {
        var checked = cellToMerge.type === 'checkbox' ? cellToMerge.checked : !!cellToMerge.value;
        return this.getCompatibleCell(__assign(__assign({}, cell), { checked: checked }));
    };
    CheckboxCellTemplate.prototype.getClassName = function (cell, isInEditMode) {
        return cell.className ? cell.className : '';
    };
    CheckboxCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        return (React.createElement("label", null,
            React.createElement("input", { type: "checkbox", checked: cell.checked, onChange: function (e) { return onCellChanged(_this.toggleCheckboxCell(cell), true); } }),
            React.createElement("span", null)));
    };
    return CheckboxCellTemplate;
}());
export { CheckboxCellTemplate };
