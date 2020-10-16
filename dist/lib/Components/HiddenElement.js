import * as React from 'react';
export var HiddenElement = function (_a) {
    var state = _a.state, hiddenElementRefHandler = _a.hiddenElementRefHandler;
    return React.createElement("input", { className: 'rg-hidden-element', ref: hiddenElementRefHandler, inputMode: 'none', onBlur: function (e) {
            var _a;
            if (!e.relatedTarget) { // prevents from losing focus on hidden element on mobile devices
                (_a = state.hiddenFocusElement) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
            }
        } });
};
