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
import { inNumericKey, isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';
import { getTimestamp, getFormattedTimeUnit } from './timeUtils';
var DateCellTemplate = (function () {
    function DateCellTemplate() {
    }
    DateCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var date = uncertainCell.date ? getCellProperty(uncertainCell, 'date', 'object') : new Date(NaN);
        var dateFormat = uncertainCell.format || new Intl.DateTimeFormat(window.navigator.language);
        var value = date.getTime();
        var text = !Number.isNaN(value) ? dateFormat.format(date) : '';
        return __assign(__assign({}, uncertainCell), { date: date, value: value, text: text });
    };
    DateCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if (!ctrl && !alt && !shift && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell(__assign({}, cell)), enableEditMode: true };
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    DateCellTemplate.prototype.update = function (cell, cellToMerge) {
        return this.getCompatibleCell(__assign(__assign({}, cell), { date: new Date(cellToMerge.value) }));
    };
    DateCellTemplate.prototype.getClassName = function (cell, isInEditMode) {
        return cell.className ? cell.className : '';
    };
    DateCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        if (!isInEditMode)
            return cell.text;
        var year = getFormattedTimeUnit(cell.date.getFullYear());
        var month = getFormattedTimeUnit(cell.date.getMonth() + 1);
        var day = getFormattedTimeUnit(cell.date.getDate());
        return React.createElement("input", { ref: function (input) {
                if (input)
                    input.focus();
            }, type: 'date', defaultValue: year + "-" + month + "-" + day, onChange: function (e) {
                var timestamp = getTimestamp(e.currentTarget.value, '');
                if (!Number.isNaN(timestamp)) {
                    onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { date: new Date(timestamp) })), false);
                }
            }, onBlur: function (e) {
                var timestamp = getTimestamp(e.currentTarget.value, '');
                if (!Number.isNaN(timestamp)) {
                    onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { date: new Date(timestamp) })), true);
                }
            }, onKeyDown: function (e) {
                if (inNumericKey(e.keyCode) || isNavigationKey(e.keyCode) || (e.keyCode === keyCodes.COMMA || e.keyCode === keyCodes.PERIOD))
                    e.stopPropagation();
                if (!inNumericKey(e.keyCode) && !isNavigationKey(e.keyCode) && (e.keyCode !== keyCodes.COMMA && e.keyCode !== keyCodes.PERIOD))
                    e.preventDefault();
            }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); } });
    };
    return DateCellTemplate;
}());
export { DateCellTemplate };
