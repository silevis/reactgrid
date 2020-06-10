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
import { inNumericKey, isNavigationKey, isNumpadNumericKey, isAllowedOnNumberTypingKey } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';
var NumberCellTemplate = (function () {
    function NumberCellTemplate() {
        this.getTextFromCharCode = function (cellText) {
            switch (cellText.charCodeAt(0)) {
                case keyCodes.DASH:
                    return '-';
                case keyCodes.COMMA:
                    return ',';
                case keyCodes.PERIOD:
                case keyCodes.DECIMAL:
                    return '.';
                default:
                    return cellText;
            }
        };
    }
    NumberCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var value;
        try {
            value = getCellProperty(uncertainCell, 'value', 'number');
        }
        catch (error) {
            value = NaN;
        }
        var numberFormat = uncertainCell.format || new Intl.NumberFormat(window.navigator.language);
        var displayValue = (uncertainCell.nanToZero && Number.isNaN(value)) ? 0 : value;
        var text = (Number.isNaN(displayValue) || (uncertainCell.hideZero && displayValue === 0)) ? '' : numberFormat.format(displayValue);
        return __assign(__assign({}, uncertainCell), { value: displayValue, text: text });
    };
    NumberCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if (isNumpadNumericKey(keyCode))
            keyCode -= 48;
        var char = String.fromCharCode(keyCode);
        if (!ctrl && !alt && !shift && (inNumericKey(keyCode) || isAllowedOnNumberTypingKey(keyCode))) {
            var value = Number(char);
            if (Number.isNaN(value) && isAllowedOnNumberTypingKey(keyCode))
                return { cell: __assign(__assign({}, this.getCompatibleCell(__assign(__assign({}, cell), { value: value }))), { text: char }), enableEditMode: true };
            return { cell: this.getCompatibleCell(__assign(__assign({}, cell), { value: value })), enableEditMode: true };
        }
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    NumberCellTemplate.prototype.update = function (cell, cellToMerge) {
        return this.getCompatibleCell(__assign(__assign({}, cell), { value: cellToMerge.value }));
    };
    NumberCellTemplate.prototype.getClassName = function (cell, isInEditMode) {
        return cell.className ? cell.className : '';
    };
    NumberCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        if (!isInEditMode) {
            return cell.text;
        }
        var locale = cell.format ? cell.format.resolvedOptions().locale : window.navigator.languages[0];
        var format = new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 });
        return React.createElement("input", { ref: function (input) {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }, defaultValue: (!Number.isNaN(cell.value) && !cell.nanToZero) ? format.format(cell.value) : this.getTextFromCharCode(cell.text), onChange: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { value: parseFloat(e.currentTarget.value.replace(/,/g, '.')) })), false); }, onBlur: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { value: parseFloat(e.currentTarget.value.replace(/,/g, '.')) })), true); }, onKeyDown: function (e) {
                if (inNumericKey(e.keyCode) || isNavigationKey(e.keyCode) || isAllowedOnNumberTypingKey(e.keyCode))
                    e.stopPropagation();
                if ((!inNumericKey(e.keyCode) && !isNavigationKey(e.keyCode) && !isAllowedOnNumberTypingKey(e.keyCode)) || e.shiftKey)
                    e.preventDefault();
            }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); } });
    };
    return NumberCellTemplate;
}());
export { NumberCellTemplate };
