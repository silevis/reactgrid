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
// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { getCharFromKeyCode } from './getCharFromKeyCode';
import { isAlphaNumericKey } from './keyCodeCheckings';
import Select from 'react-select';
import { keyCodes } from '../Functions/keyCodes';
var DropdownCellTemplate = /** @class */ (function () {
    function DropdownCellTemplate() {
    }
    DropdownCellTemplate.prototype.getCompatibleCell = function (uncertainCell) {
        var selectedValue;
        try {
            selectedValue = getCellProperty(uncertainCell, 'selectedValue', 'string');
        }
        catch (_a) {
            selectedValue = undefined;
        }
        var values = getCellProperty(uncertainCell, 'values', 'object');
        var value = selectedValue ? parseFloat(selectedValue) : NaN;
        var isDisabled = true;
        try {
            isDisabled = getCellProperty(uncertainCell, 'isDisabled', 'boolean');
        }
        catch (_b) {
            isDisabled = false;
        }
        var inputValue;
        try {
            inputValue = getCellProperty(uncertainCell, 'inputValue', 'string');
        }
        catch (_c) {
            inputValue = undefined;
        }
        var isOpen;
        try {
            isOpen = getCellProperty(uncertainCell, 'isOpen', 'boolean');
        }
        catch (_d) {
            isOpen = false;
        }
        var text = selectedValue || '';
        return __assign(__assign({}, uncertainCell), { selectedValue: selectedValue, text: text, value: value, values: values, isDisabled: isDisabled, isOpen: isOpen, inputValue: inputValue });
    };
    DropdownCellTemplate.prototype.update = function (cell, cellToMerge) {
        return this.getCompatibleCell(__assign(__assign({}, cell), { selectedValue: cellToMerge.selectedValue, isOpen: cellToMerge.isOpen, inputValue: cellToMerge.inputValue }));
    };
    DropdownCellTemplate.prototype.getClassName = function (cell, isInEditMode) {
        var isOpen = cell.isOpen ? 'open' : 'closed';
        return "" + (cell.className ? cell.className : '') + isOpen;
    };
    DropdownCellTemplate.prototype.handleKeyDown = function (cell, keyCode, ctrl, shift, alt) {
        if ((keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) && !shift) {
            return { cell: this.getCompatibleCell(__assign(__assign({}, cell), { isOpen: !cell.isOpen })), enableEditMode: false };
        }
        var char = getCharFromKeyCode(keyCode, shift);
        if (!ctrl && !alt && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell(__assign(__assign({}, cell), { inputValue: shift ? char : char.toLowerCase(), isOpen: !cell.isOpen })), enableEditMode: false };
        return { cell: cell, enableEditMode: false };
    };
    DropdownCellTemplate.prototype.render = function (cell, isInEditMode, onCellChanged) {
        var _this = this;
        var selectRef = React.useRef(null);
        var _a = React.useState(cell.inputValue), inputValue = _a[0], setInputValue = _a[1];
        React.useEffect(function () {
            if (cell.isOpen && selectRef.current) {
                selectRef.current.focus();
                setInputValue(cell.inputValue);
            }
        }, [cell.isOpen, cell.inputValue]);
        return (React.createElement("div", { style: { width: '100%' }, onPointerDown: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { isOpen: true })), true); } },
            React.createElement(Select, __assign({}, (cell.inputValue && {
                inputValue: inputValue,
                defaultInputValue: inputValue,
                onInputChange: function (e) { return setInputValue(e); },
            }), { isSearchable: true, ref: selectRef }, (cell.isOpen !== undefined && { menuIsOpen: cell.isOpen }), { onMenuClose: function () { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { isOpen: !cell.isOpen, inputValue: undefined })), true); }, onMenuOpen: function () { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { isOpen: true })), true); }, onChange: function (e) { return onCellChanged(_this.getCompatibleCell(__assign(__assign({}, cell), { selectedValue: e.value, isOpen: false, inputValue: undefined })), true); }, blurInputOnSelect: true, defaultValue: cell.values.find(function (val) { return val.value === cell.selectedValue; }), isDisabled: cell.isDisabled, options: cell.values, onKeyDown: function (e) { return e.stopPropagation(); }, components: {
                    Option: CustomOption,
                    Menu: CustomMenu,
                }, styles: {
                    container: function (provided) { return (__assign(__assign({}, provided), { width: '100%', height: '100%' })); },
                    control: function (provided) { return (__assign(__assign({}, provided), { border: 'none', borderColor: 'transparent', minHeight: '25px', background: 'transparent', boxShadow: 'none' })); },
                    indicatorsContainer: function (provided) { return (__assign(__assign({}, provided), { paddingTop: '0px' })); },
                    dropdownIndicator: function (provided) { return (__assign(__assign({}, provided), { padding: '0px 4px' })); },
                    singleValue: function (provided) { return (__assign(__assign({}, provided), { color: 'inherit' })); },
                    indicatorSeparator: function (provided) { return (__assign(__assign({}, provided), { marginTop: '4px', marginBottom: '4px' })); },
                    input: function (provided) { return (__assign(__assign({}, provided), { padding: 0 })); },
                    valueContainer: function (provided) { return (__assign(__assign({}, provided), { padding: '0 8px' })); },
                } }))));
    };
    return DropdownCellTemplate;
}());
export { DropdownCellTemplate };
var CustomOption = function (_a) {
    var innerProps = _a.innerProps, label = _a.label, isSelected = _a.isSelected, isFocused = _a.isFocused;
    return (React.createElement("div", __assign({}, innerProps, { onPointerDown: function (e) { return e.stopPropagation(); }, className: "dropdown-option" + (isSelected ? ' selected' : '') + (isFocused ? ' focused' : '') }), label));
};
var CustomMenu = function (_a) {
    var innerProps = _a.innerProps, children = _a.children;
    return (React.createElement("div", __assign({}, innerProps, { className: 'dropdown-menu' }), children));
};
