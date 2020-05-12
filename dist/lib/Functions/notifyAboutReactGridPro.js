export var notifyAboutReactGridPro = function (state) {
    var _a, _b, _c, _d, _e, _f;
    var notification = function (fn) { return fn && console.warn("Sorry, " + fn.name + " isn't implemented in MIT version, buy ReactGrid Pro"); };
    notification((_a = state.props) === null || _a === void 0 ? void 0 : _a.onColumnResized);
    notification((_b = state.props) === null || _b === void 0 ? void 0 : _b.canReorderRows);
    notification((_c = state.props) === null || _c === void 0 ? void 0 : _c.onRowsReordered);
    notification((_d = state.props) === null || _d === void 0 ? void 0 : _d.canReorderColumns);
    notification((_e = state.props) === null || _e === void 0 ? void 0 : _e.onColumnsReordered);
    notification((_f = state.props) === null || _f === void 0 ? void 0 : _f.onContextMenu);
};
