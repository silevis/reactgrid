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
import { recalcVisibleRange } from '../Functions/recalcVisibleRange';
import { getScrollableParent, getScrollOfScrollableElement } from '../Functions/scrollHelpers';
import { getVisibleSizeOfReactGrid } from '../Functions/elementSizeHelpers';
var EventHandlers = /** @class */ (function () {
    function EventHandlers(updateState, pointerEventsController) {
        var _this = this;
        this.updateState = updateState;
        this.pointerEventsController = pointerEventsController;
        this.pointerDownHandler = function (event) { return _this.updateState(function (state) { return _this.pointerEventsController.handlePointerDown(event, state); }); };
        this.keyDownHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handleKeyDown(event, state); }); };
        this.keyUpHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handleKeyUp(event, state); }); };
        this.copyHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handleCopy(event, state); }); };
        this.pasteHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handlePaste(event, state); }); };
        this.cutHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handleCut(event, state); }); };
        this.blurHandler = function (event) { return _this.updateState(function (state) {
            var _a, _b;
            if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.id.startsWith('react-select-')) { // give back focus on react-select dropdown blur
                (_b = state.hiddenFocusElement) === null || _b === void 0 ? void 0 : _b.focus({ preventScroll: true });
            }
            return state;
        }); };
        this.windowResizeHandler = function () { return _this.updateState(recalcVisibleRange); };
        this.reactgridRefHandler = function (reactGridElement) { return _this.assignScrollHandler(reactGridElement, recalcVisibleRange); };
        this.hiddenElementRefHandler = function (hiddenFocusElement) { return _this.updateState(function (state) {
            var _a;
            if (((_a = state.props) === null || _a === void 0 ? void 0 : _a.initialFocusLocation) && hiddenFocusElement) {
                hiddenFocusElement.focus({ preventScroll: true });
            }
            state.hiddenFocusElement = hiddenFocusElement;
            return state;
        }); };
        this.pasteCaptureHandler = function (event) {
            var htmlData = event.clipboardData.getData('text/html');
            var parsedData = new DOMParser().parseFromString(htmlData, 'text/html');
            if (htmlData && parsedData.body.firstElementChild.getAttribute('data-reactgrid') === 'reactgrid-content') {
                event.bubbles = false;
            }
        };
        this.scrollHandler = function (visibleRangeCalculator) { return _this.updateOnScrollChange(visibleRangeCalculator); };
        this.assignScrollHandler = function (reactGridElement, visibleRangeCalculator) {
            if (reactGridElement) {
                _this.updateState(function (state) {
                    var scrollableElement = getScrollableParent(reactGridElement, true);
                    scrollableElement.addEventListener('scroll', function () { return _this.scrollHandler(visibleRangeCalculator); });
                    return visibleRangeCalculator(__assign(__assign({}, state), { reactGridElement: reactGridElement, scrollableElement: scrollableElement }));
                });
            }
        };
        this.updateOnScrollChange = function (visibleRangeCalculator) {
            _this.updateState(function (state) {
                var PAGE_UPDATE_OFFSET = 200;
                var _a = getScrollOfScrollableElement(state.scrollableElement), scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
                var _b = getVisibleSizeOfReactGrid(state), width = _b.width, height = _b.height;
                var shouldBeVisibleRangeRecalc = width > 0 && height > 0 && (scrollTop >= state.bottomScrollBoudary - PAGE_UPDATE_OFFSET || scrollTop <= state.topScrollBoudary + PAGE_UPDATE_OFFSET ||
                    scrollLeft >= state.rightScrollBoudary - PAGE_UPDATE_OFFSET || scrollLeft <= state.leftScrollBoudary + PAGE_UPDATE_OFFSET);
                return shouldBeVisibleRangeRecalc ? visibleRangeCalculator(state) : state;
            });
        };
    }
    return EventHandlers;
}());
export { EventHandlers };
