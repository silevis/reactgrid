export var notifyAboutReactGridPro = function (state) {
    var _a, _b, _c, _d;
    var notification = function (fn, name) {
        return fn && console.warn("Sorry, " + (fn.name || name) + " isn't implemented in MIT version, buy ReactGrid Pro");
    };
    notification((_a = state.props) === null || _a === void 0 ? void 0 : _a.onColumnResized, 'onColumnResized');
    notification((_b = state.props) === null || _b === void 0 ? void 0 : _b.onRowsReordered, 'onRowsReordered');
    notification((_c = state.props) === null || _c === void 0 ? void 0 : _c.onColumnsReordered, 'onColumnsReordered');
    notification((_d = state.props) === null || _d === void 0 ? void 0 : _d.onContextMenu, 'onContextMenu');
};
