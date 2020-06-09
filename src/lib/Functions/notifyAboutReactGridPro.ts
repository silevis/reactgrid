import { State } from '../Model';

export const notifyAboutReactGridPro = (state: State) => {
    const notification = (fn: any, name: string) =>
        fn && console.warn(`Sorry, ${fn.name || name} isn't implemented in MIT version, buy ReactGrid Pro`);
    notification(state.props?.onColumnResized!, 'onColumnResized');
    notification(state.props?.onRowsReordered!, 'onRowsReordered');
    notification(state.props?.onColumnsReordered!, 'onColumnsReordered');
    notification(state.props?.onContextMenu!, 'onContextMenu');
    notification(state.props?.enableFillHandle, 'fillHandle');
    notification(state.props?.enableRangeSelection, 'rangeSelection');
}