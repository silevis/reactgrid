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
import * as React from 'react';
var LegacyBrowserGridRenderer = (function (_super) {
    __extends(LegacyBrowserGridRenderer, _super);
    function LegacyBrowserGridRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LegacyBrowserGridRenderer.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", null, "Please update to a modern browser."),
            React.createElement("p", null, "Your current browser cannot run our content, please make sure you browser is fully updated or try a different browser. We highly recommend using the most recent release of Google Chrome, Microsoft Edge, Firefox, Safari, and Opera browser")));
    };
    return LegacyBrowserGridRenderer;
}(React.Component));
export { LegacyBrowserGridRenderer };
