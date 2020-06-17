import * as React from 'react';
import { i18n } from '../Functions/i18n';
export var LegacyBrowserGridRenderer = function (_a) {
    var state = _a.state;
    return (React.createElement(React.Fragment, null,
        React.createElement("h3", null, i18n(state).legacyBrowserHeader),
        React.createElement("p", null, i18n(state).legacyBrowserText)));
};
