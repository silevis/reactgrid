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
import React, { Component } from 'react';
var ErrorBoundary = (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hasError: false,
        };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        this.setState({ errorInfo: errorInfo });
    };
    ErrorBoundary.prototype.render = function () {
        var _a = this.state, hasError = _a.hasError, errorInfo = _a.errorInfo, error = _a.error;
        if (hasError) {
            return (React.createElement(React.Fragment, null,
                React.createElement("h1", null, error === null || error === void 0 ? void 0 : error.message),
                " ",
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("details", null, error === null || error === void 0 ? void 0 :
                    error.stack, errorInfo === null || errorInfo === void 0 ? void 0 :
                    errorInfo.componentStack)));
        }
        else {
            return this.props.children;
        }
    };
    return ErrorBoundary;
}(Component));
export { ErrorBoundary };
