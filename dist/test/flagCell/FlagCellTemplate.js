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
import { isNavigationKey, getCellProperty, isAlphaNumericKey, keyCodes } from '../../reactgrid';
import './flag-cell-style.scss';
var FlagCellTemplate = /** @class */ (function () {
    function FlagCellTemplate() {
    }
    FlagCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var text = getCellProperty(uncertainCell, 'text', 'string');
        var value = parseFloat(text);
        return __assign(__assign({}, uncertainCell), { text: text, value: value });
    };
    FlagCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if (!ctrl && !alt && isAlphaNumericKey(keyCode))
            return { cell: cell, enableEditMode: true };
        return { cell: cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER };
    };
    FlagCellTemplate.prototype.update = function (cell, cellToMerge) {
        return this.getCompatibleCell(__assign(__assign({}, cell), { text: cellToMerge.text }));
    };
    FlagCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        if (!isInEditMode) {
            var flagISO = cell.text.toLowerCase(); // ISO 3166-1, 2/3 letters
            var flagURL = "https://restcountries.eu/data/" + flagISO + ".svg";
            return React.createElement("div", { className: 'rg-flag-wrapper', style: {
                    backgroundImage: 'url("' + flagURL + '"), url("https://upload.wikimedia.org/wikipedia/commons/0/04/Nuvola_unknown_flag.svg")',
                } });
        }
        return React.createElement("input", { ref: function (input) {
                input && input.focus();
            }, defaultValue: cell.text, onChange: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { text: e.currentTarget.value })), false); }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); }, onBlur: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { text: e.currentTarget.value })), true); }, onKeyDown: function (e) {
                if (isAlphaNumericKey(e.keyCode) || isNavigationKey(e.keyCode))
                    e.stopPropagation();
                if (e.keyCode === keyCodes.ESCAPE)
                    e.currentTarget.value = cell.text; // reset
            } });
    };
    return FlagCellTemplate;
}());
export { FlagCellTemplate };
