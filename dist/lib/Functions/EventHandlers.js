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
import { PointerEventsController } from './PointerEventsController';
import { recalcVisibleRange, getScrollableParent, getScrollOfScrollableElement } from '.';
import { getReactGridOffsets, getVisibleSizeOfReactGrid } from './elementSizeHelpers';
var EventHandlers = (function () {
    function EventHandlers(updateState) {
        var _this = this;
        this.updateState = updateState;
        this.pointerEventsController = new PointerEventsController(this.updateState);
        this.pointerDownHandler = function (event) { return _this.updateState(function (state) { return _this.pointerEventsController.handlePointerDown(event, state); }); };
        this.keyDownHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handleKeyDown(event, state); }); };
        this.keyUpHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handleKeyUp(event, state); }); };
        this.copyHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handleCopy(event, state); }); };
        this.pasteHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handlePaste(event, state); }); };
        this.cutHandler = function (event) { return _this.updateState(function (state) { return state.currentBehavior.handleCut(event, state); }); };
        this.windowResizeHandler = function () { return _this.updateState(recalcVisibleRange); };
        this.reactgridRefHandler = function (reactGridElement) {
            if (reactGridElement) {
                _this.updateState(function (state) {
                    var scrollableElement = getScrollableParent(reactGridElement, true);
                    scrollableElement.addEventListener('scroll', _this.scrollHandler);
                    return recalcVisibleRange(__assign(__assign({}, state), { reactGridElement: reactGridElement, scrollableElement: scrollableElement }));
                });
            }
        };
        this.hiddenElementRefHandler = function (hiddenFocusElement) { return _this.updateState(function (state) { state.hiddenFocusElement = hiddenFocusElement; return state; }); };
        this.pasteCaptureHandler = function (event) {
            var htmlData = event.clipboardData.getData('text/html');
            var parsedData = new DOMParser().parseFromString(htmlData, 'text/html');
            if (htmlData && parsedData.body.firstElementChild.getAttribute('data-reactgrid') === 'reactgrid-content') {
                event.bubbles = false;
            }
        };
        this.scrollHandler = function () {
            return _this.updateState(function (state) {
                var _a, _b, _c, _d;
                var _e = getScrollOfScrollableElement(state.scrollableElement), scrollTop = _e.scrollTop, scrollLeft = _e.scrollLeft;
                var _f = getReactGridOffsets(state), top = _f.top, left = _f.left;
                var _g = getVisibleSizeOfReactGrid(state), width = _g.width, height = _g.height;
                return width > 0 && height > 0 && (scrollTop > state.maxScrollTop
                    || scrollTop < state.minScrollTop
                    || scrollLeft > state.maxScrollLeft
                    || scrollLeft < state.minScrollLeft
                    || scrollLeft === 0
                    || scrollLeft - left > state.visibleRange.first.column.right
                    || scrollLeft - left < state.visibleRange.last.column.left - width
                    || scrollTop - top > ((_b = (_a = state.visibleRange.first.row) === null || _a === void 0 ? void 0 : _a.bottom) !== null && _b !== void 0 ? _b : 0)
                    || scrollTop - top < ((_d = (_c = state.visibleRange.last.row) === null || _c === void 0 ? void 0 : _c.top) !== null && _d !== void 0 ? _d : 0) - height
                    || scrollTop === 0)
                    ? recalcVisibleRange(state)
                    : state;
            });
        };
    }
    return EventHandlers;
}());
export { EventHandlers };
