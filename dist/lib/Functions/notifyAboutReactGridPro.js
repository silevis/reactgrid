var notification = function (prop, name) { return (prop || prop === false || typeof prop === 'number') &&
    console.warn("Sorry, " + ((prop === null || prop === void 0 ? void 0 : prop.name) || name) + " isn't implemented in MIT version, buy ReactGrid Pro"); };
export var notifyAboutReactGridPro = function (state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    notification((_a = state.props) === null || _a === void 0 ? void 0 : _a.onColumnResized, 'onColumnResized');
    notification((_b = state.props) === null || _b === void 0 ? void 0 : _b.onRowsReordered, 'onRowsReordered');
    notification((_c = state.props) === null || _c === void 0 ? void 0 : _c.onColumnsReordered, 'onColumnsReordered');
    notification((_d = state.props) === null || _d === void 0 ? void 0 : _d.onContextMenu, 'onContextMenu');
    notification((_e = state.props) === null || _e === void 0 ? void 0 : _e.enableFillHandle, 'fillHandle');
    notification((_f = state.props) === null || _f === void 0 ? void 0 : _f.enableRangeSelection, 'rangeSelection');
    notification((_g = state.props) === null || _g === void 0 ? void 0 : _g.enableColumnSelection, 'columnSelection');
    notification((_h = state.props) === null || _h === void 0 ? void 0 : _h.enableRowSelection, 'rowSelection');
    notification((_j = state.props) === null || _j === void 0 ? void 0 : _j.stickyBottomRows, 'stickyBottomRows');
    notification((_k = state.props) === null || _k === void 0 ? void 0 : _k.stickyRightColumns, 'stickyRightColumns');
};
