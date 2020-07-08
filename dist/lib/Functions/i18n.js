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
var defultTranslations = {
    legacyBrowserHeader: 'Please update to a modern browser.',
    legacyBrowserText: 'Your current browser cannot run our content, please make sure you browser is fully updated or try adifferent browser. We highly recommend using the most recent release of Google Chrome, Microsoft Edge, Firefox, Safari, and Opera browser',
    copyLabel: 'Copy',
    cutLabel: 'Cut',
    pasteLabel: 'Paste',
    appleMobileDeviceContextMenuPasteAlert: 'Use ⌘ + c for copy, ⌘ + x for cut and ⌘ + v for paste.',
    otherBrowsersContextMenuPasteAlert: ' Use ctrl + c for copy, ctrl + x for cut and ctrl + v for paste.',
    actionNotSupported: 'This action is not supported in this browser.'
};
export function i18n(state) {
    var _a;
    return __assign(__assign({}, defultTranslations), (_a = state.props) === null || _a === void 0 ? void 0 : _a.labels);
}
