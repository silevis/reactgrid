var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Behavior } from "../Model";
import { handleKeyDown } from "../Functions/handleKeyDown";
import { keyCodes, isBrowserSafari } from "../Functions";
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { areLocationsEqual } from '../Functions/areLocationsEqual';
import { isSelectionKey } from '../Functions/isSelectionKey';
import { CellSelectionBehavior } from './CellSelectionBehavior';
import { handlePaste } from '../Functions/handlePaste';
import { copySelectedRangeToClipboardOnSafari, copySelectedRangeToClipboard } from '../Functions/copySelectedRange';
var DefaultBehavior = (function (_super) {
    __extends(DefaultBehavior, _super);
    function DefaultBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultBehavior.prototype.handlePointerDown = function (event, location, state) {
        state = __assign(__assign({}, state), { currentBehavior: this.getNewBehavior(event, location, state) });
        return state.currentBehavior.handlePointerDown(event, location, state);
    };
    DefaultBehavior.prototype.getNewBehavior = function (event, location, state) {
        return new CellSelectionBehavior();
    };
    DefaultBehavior.prototype.handleDoubleClick = function (event, location, state) {
        if (areLocationsEqual(location, state.focusedLocation)) {
            var _a = getCompatibleCellAndTemplate(state, location), cell = _a.cell, cellTemplate = _a.cellTemplate;
            if (cellTemplate.handleKeyDown) {
                var _b = cellTemplate.handleKeyDown(cell, 1, isSelectionKey(event), event.shiftKey, event.altKey), newCell = _b.cell, enableEditMode = _b.enableEditMode;
                if (enableEditMode) {
                    return __assign(__assign({}, state), { currentlyEditedCell: newCell });
                }
            }
        }
        return state;
    };
    DefaultBehavior.prototype.handleKeyDown = function (event, state) {
        return handleKeyDown(state, event);
    };
    DefaultBehavior.prototype.handleKeyUp = function (event, state) {
        if (event.keyCode === keyCodes.TAB || event.keyCode === keyCodes.ENTER) {
            event.preventDefault();
            event.stopPropagation();
        }
        return state;
    };
    DefaultBehavior.prototype.handleCopy = function (event, state) {
        if (isBrowserSafari()) {
            copySelectedRangeToClipboardOnSafari(event, state);
        }
        else {
            copySelectedRangeToClipboard(state);
        }
        event.preventDefault();
        return __assign({}, state);
    };
    DefaultBehavior.prototype.handlePaste = function (event, state) {
        return handlePaste(event, state);
    };
    DefaultBehavior.prototype.handleCut = function (event, state) {
        if (isBrowserSafari()) {
            copySelectedRangeToClipboardOnSafari(event, state, true);
        }
        else {
            copySelectedRangeToClipboard(state, true);
        }
        event.preventDefault();
        return state;
    };
    return DefaultBehavior;
}(Behavior));
export { DefaultBehavior };
