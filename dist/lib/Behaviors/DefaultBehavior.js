var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
import { handleCopy } from '../Functions/handleCopy';
import { handleDoubleClick } from '../Functions/handleDoubleClick';
import { handleKeyDown } from '../Functions/handleKeyDown';
import { handleKeyUp } from '../Functions/handleKeyUp';
import { handlePaste } from '../Functions/handlePaste';
import { Behavior } from '../Model/Behavior';
import { CellSelectionBehavior } from './CellSelectionBehavior';
var DefaultBehavior = /** @class */ (function (_super) {
    __extends(DefaultBehavior, _super);
    function DefaultBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultBehavior.prototype.handlePointerDown = function (event, location, state) {
        state = __assign(__assign({}, state), { currentBehavior: new CellSelectionBehavior() });
        return state.currentBehavior.handlePointerDown(event, location, state);
    };
    DefaultBehavior.prototype.handleDoubleClick = function (event, location, state) {
        return handleDoubleClick(event, location, state);
    };
    DefaultBehavior.prototype.handleKeyDown = function (event, state) {
        return handleKeyDown(state, event);
    };
    DefaultBehavior.prototype.handleKeyUp = function (event, state) {
        return handleKeyUp(event, state);
    };
    DefaultBehavior.prototype.handleCopy = function (event, state) {
        return handleCopy(event, state);
    };
    DefaultBehavior.prototype.handlePaste = function (event, state) {
        return handlePaste(event, state);
    };
    DefaultBehavior.prototype.handleCut = function (event, state) {
        return handleCopy(event, state, true);
    };
    return DefaultBehavior;
}(Behavior));
export { DefaultBehavior };
