import { State } from '../Model/State';

const notification = (prop: any, name: string) => (prop || prop === false || typeof prop === 'number') &&
    console.warn(`Sorry, ${prop?.name || name} isn't implemented in MIT version, buy ReactGrid Pro`);

export const notifyAboutReactGridPro = (state: State) => {
    notification(state.props?.onColumnResized!, 'onColumnResized');
    notification(state.props?.onRowsReordered!, 'onRowsReordered');
    notification(state.props?.onColumnsReordered!, 'onColumnsReordered');
    notification(state.props?.onContextMenu!, 'onContextMenu');
    notification(state.props?.enableFillHandle, 'fillHandle');
    notification(state.props?.enableRangeSelection, 'rangeSelection');
    notification(state.props?.enableColumnSelection, 'columnSelection');
    notification(state.props?.enableRowSelection, 'rowSelection');
    notification(state.props?.stickyBottomRows, 'stickyBottomRows');
    notification(state.props?.stickyRightColumns, 'stickyRightColumns');
}