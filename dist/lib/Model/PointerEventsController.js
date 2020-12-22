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
import { getLocationFromClient } from '../Functions/getLocationFromClient';
import { AbstractPointerEventsController, isOnClickableArea, isReadyToHandleEvent } from './AbstractPointerEventsController';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
var PointerEventsController = /** @class */ (function (_super) {
    __extends(PointerEventsController, _super);
    function PointerEventsController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handlePointerDown = function (event, state) {
            if (!isReadyToHandleEvent(event) || !isOnClickableArea(event, state))
                return state;
            window.addEventListener('pointerup', _this.handlePointerUp);
            var currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
            return _this.handlePointerDownInternal(event, currentLocation, state);
        };
        _this.handlePointerUp = function (event) {
            if (event.button !== 0 && event.button !== undefined)
                return;
            window.removeEventListener('pointerup', _this.handlePointerUp);
            _this.updateState(function (state) {
                var _a;
                var currentLocation = getLocationFromClient(state, event.clientX, event.clientY);
                var currentTimestamp = new Date().valueOf();
                var secondLastTimestamp = _this.eventTimestamps[1 - _this.currentIndex];
                state = state.currentBehavior.handlePointerUp(event, currentLocation, state);
                if (_this.shouldHandleCellSelectionOnMobile(event, currentLocation, currentTimestamp)) {
                    state = state.currentBehavior.handlePointerDown(event, currentLocation, state);
                }
                state = __assign(__assign({}, state), { currentBehavior: new DefaultBehavior() });
                if (_this.shouldHandleDoubleClick(currentLocation, currentTimestamp, secondLastTimestamp)) {
                    state = state.currentBehavior.handleDoubleClick(event, currentLocation, state);
                }
                (_a = state.hiddenFocusElement) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
                return state;
            });
        };
        return _this;
    }
    return PointerEventsController;
}(AbstractPointerEventsController));
export { PointerEventsController };
