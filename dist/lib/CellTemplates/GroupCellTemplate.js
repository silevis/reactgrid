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
import { keyCodes } from '../Functions';
import { isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings';
import { getCellProperty } from '..';
import { getCharFromKeyCode } from './getCharFromKeyCode';
var GroupCellTemplate = (function () {
    function GroupCellTemplate() {
    }
    GroupCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var text = getCellProperty(uncertainCell, 'text', 'string');
        var isExpanded = false;
        try {
            isExpanded = getCellProperty(uncertainCell, 'isExpanded', 'boolean');
        }
        catch (_a) {
            isExpanded = true;
        }
        var indent = -1;
        try {
            indent = getCellProperty(uncertainCell, 'indent', 'number');
        }
        catch (_b) {
            indent = 0;
        }
        var hasChildrens = false;
        try {
            hasChildrens = getCellProperty(uncertainCell, 'hasChildrens', 'boolean');
        }
        catch (_c) {
            hasChildrens = false;
        }
        var value = parseFloat(text);
        return __assign(__assign({}, uncertainCell), { text: text, value: value, isExpanded: isExpanded, hasChildrens: hasChildrens, indent: indent });
    };
    GroupCellTemplate.prototype.update = function (cell, cellToMerge) {
        return this.getCompatibleCell(__assign(__assign({}, cell), { isExpanded: cellToMerge.isExpanded, text: cellToMerge.text }));
    };
    GroupCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        var enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        var cellCopy = __assign({}, cell);
        var char = getCharFromKeyCode(keyCode, shift);
        if (keyCode === keyCodes.SPACE && cellCopy.isExpanded !== undefined && !shift) {
            cellCopy.isExpanded = !cellCopy.isExpanded;
        }
        else if (!ctrl && !alt && isAlphaNumericKey(keyCode) && !(shift && keyCode === keyCodes.SPACE)) {
            cellCopy.text = !shift ? char.toLowerCase() : char;
            enableEditMode = true;
        }
        return { cell: cellCopy, enableEditMode: enableEditMode };
    };
    GroupCellTemplate.prototype.getClassName = function (cell, isInEditMode) {
        var _a;
        var isExpanded = cell.hasChildrens ? cell.isExpanded ? 'expanded' : 'collapsed' : '';
        var className = (_a = cell.className) !== null && _a !== void 0 ? _a : '';
        return isExpanded + " " + className;
    };
    GroupCellTemplate.prototype.getStyle = function (cell, isInEditMode) {
        var _a;
        var indent = (_a = cell.indent) !== null && _a !== void 0 ? _a : 0;
        var elementMarginMultiplier = indent * 1.4;
        return { paddingLeft: "calc(" + elementMarginMultiplier + "em + 2px)" };
    };
    GroupCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        return (!isInEditMode ?
            React.createElement(React.Fragment, null,
                cell.hasChildrens &&
                    React.createElement("div", { className: "chevron", onPointerDown: function (e) {
                            e.stopPropagation();
                            onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { isExpanded: !cell.isExpanded })), true);
                        } },
                        React.createElement("span", { className: "icon" }, "\u276F")),
                cell.text)
            :
                React.createElement("input", { ref: function (input) {
                        if (input) {
                            input.focus();
                            input.setSelectionRange(input.value.length, input.value.length);
                        }
                    }, defaultValue: cell.text, onChange: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { text: e.currentTarget.value })), false); }, onBlur: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { text: e.currentTarget.value })), true); }, onCopy: function (e) { return e.stopPropagation(); }, onCut: function (e) { return e.stopPropagation(); }, onPaste: function (e) { return e.stopPropagation(); }, onPointerDown: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) {
                        if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode)))
                            e.stopPropagation();
                    } }));
    };
    return GroupCellTemplate;
}());
export { GroupCellTemplate };
