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
import { isBrowserFirefox } from '../Functions/firefox';
export var PaneShadow = function (_a) {
    var renderCondition = _a.renderCondition, className = _a.className, style = _a.style, zIndex = _a.zIndex, children = _a.children;
    if (renderCondition) {
        return (React.createElement("div", { className: "shadow " + className, style: __assign(__assign({}, style), (isBrowserFirefox() && { zIndex: zIndex })) }, children));
    }
    return null;
};
