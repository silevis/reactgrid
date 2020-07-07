import { RowsProps } from '../core';


export function paneUpdatePredicate(prevProps: RowsProps, nextProps: RowsProps) {
    const { state } = prevProps;
    if (state.focusedLocation && nextProps.state.focusedLocation) {
        if (state.focusedLocation.column.columnId !== nextProps.state.focusedLocation.column.columnId || state.focusedLocation.row.rowId !== nextProps.state.focusedLocation.row.rowId)
            // && // needed when select range by touch
            //nextProps.state.lastKeyCode !== keyCodes.ENTER && nextProps.state.lastKeyCode !== keyCodes.TAB) // improved performance during moving focus inside range
            return true;
    } else {
        return true; // needed when select range by touch after first focus
    }
    return state.visibleRange !== nextProps.state.visibleRange || state.cellMatrix.props !== nextProps.state.cellMatrix.props;
}