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
import { getTimestamp, getFormattedTimeUnit, getDefaultDate } from './timeUtils';
var TimeCellTemplate = (function () {
    function TimeCellTemplate() {
    }
    TimeCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var time = uncertainCell.time ? getCellProperty(uncertainCell, 'time', 'object') : new Date(NaN);
        var timeFormat = uncertainCell.format || new Intl.DateTimeFormat(window.navigator.language);
        var value = time.getTime() % TimeCellTemplate.dayInMillis;
        var text = !Number.isNaN(value) ? timeFormat.format(time) : '';
        return __assign(__assign({}, uncertainCell), { time: time, value: value, text: text });
    };
    TimeCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if (!ctrl && !alt && !shift && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell(__assign({}, cell)), enableEditMode: true };
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    TimeCellTemplate.prototype.update = function (cell, cellToMerge) {
        var timestamp = getTimestamp(cellToMerge.text);
        if (cellToMerge.text !== '' && !Number.isNaN(timestamp))
            return this.getCompatibleCell(__assign(__assign({}, cell), { time: new Date(timestamp) }));
        return this.getCompatibleCell(__assign(__assign({}, cell), { time: new Date(cellToMerge.value) }));
    };
    TimeCellTemplate.prototype.getClassName = function (cell, isInEditMode) {
        return cell.className ? cell.className : '';
    };
    TimeCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        if (!isInEditMode)
            return cell.text;
        var hours = getFormattedTimeUnit(cell.time.getHours());
        var minutes = getFormattedTimeUnit(cell.time.getMinutes());
        return React.createElement("input", { ref: function (input) {
                if (input)
                    input.focus();
            }, type: "time", defaultValue: hours + ":" + minutes, onChange: function (e) {
                var timestamp = getTimestamp(e.currentTarget.value);
                if (!Number.isNaN(timestamp))
                    onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { time: new Date(timestamp) })), false);
            }, onBlur: function (e) {
                var timestamp = getTimestamp(e.currentTarget.value);
                if (!Number.isNaN(timestamp))
                    onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { time: new Date(timestamp) })), true);
            }, onKeyDown: function (e) {
                if (inNumericKey(e.keyCode) || isNavigationKey(e.keyCode) || (e.keyCode === keyCodes.COMMA || e.keyCode === keyCodes.PERIOD))
                    e.stopPropagation();
                if (!inNumericKey(e.keyCode) && !isNavigationKey(e.keyCode) && (e.keyCode !== keyCodes.COMMA && e.keyCode !== keyCodes.PERIOD))
                    e.preventDefault();
            }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); } });
    };
    TimeCellTemplate.dayInMillis = 86400000;
    TimeCellTemplate.defaultDate = getDefaultDate();
    return TimeCellTemplate;
}());
export { TimeCellTemplate };
