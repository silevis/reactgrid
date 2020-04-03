export var notifyAboutReactGridPro = function (state) {
    var notification = function (fn) { return fn && console.warn("Sorry, " + fn.name + " isn't implemented in MIT version, buy ReactGrid Pro"); };
    notification(state.props.onColumnResized);
    notification(state.props.canReorderRows);
    notification(state.props.onRowsReordered);
    notification(state.props.canReorderColumns);
    notification(state.props.onColumnsReordered);
    notification(state.props.onContextMenu);
};
