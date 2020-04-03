import * as React from 'react';
import { State, Location } from '../Model';
import { tryAppendChange, getTopScrollableElement, getScrollOfScrollableElement } from '../Functions';
import { getReactGridOffsets, getStickyOffset, getOffsetsOfElement } from '../Functions/elementSizeHelpers';

interface CellEditorProps {
    state: State;
}

export const CellEditor: React.FunctionComponent<CellEditorProps> = props => {

    const location = props.state.focusedLocation!;
    const currentlyEditedCell = props.state.currentlyEditedCell;
    const [position, dispatch] = React.useReducer(positionReducer, { state: props.state, location });
    React.useEffect(() => dispatch(), []);

    if (!currentlyEditedCell) { // prevents to unexpectly opening cell editor on cypress
        return null;
    }
    const cellTemplate = props.state.cellTemplates[currentlyEditedCell.type];
    // TODO custom style
    //const customStyle = cellTemplate.getCustomStyle ? cellTemplate.getCustomStyle(cell.data, true) : {};
    return (
        <div
            className={`rg-celleditor rg-${currentlyEditedCell.type}-celleditor`}
            data-cy="rg-celleditor"
            style={{
                top: position.top && (position.top + (props.state.disableFloatingCellEditor ? 0 : -1)),
                left: position.left && (position.left + (props.state.disableFloatingCellEditor ? 0 : -1)),
                height: location.row.height + 1,
                width: location.column.width + 1,
                position: props.state.disableFloatingCellEditor ? 'absolute' : 'fixed',
                //...customStyle,
            }}
        >
            {cellTemplate.render(props.state.currentlyEditedCell!, true, (cell, commit) => {
                props.state.currentlyEditedCell = commit ? undefined : cell;
                if (commit) props.state.update(state => tryAppendChange(state, location, cell));
            })}
        </div>
    );
};

const calculatedXAxisOffset = (location: Location, state: State) => {
    const cellMatrix = state.cellMatrix;
    const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { left } = getReactGridOffsets(state);
    const leftStickyOffset = getStickyOffset(scrollLeft, left);

    if (location.column.idx > (cellMatrix.stickyLeftRange.last.column ? cellMatrix.stickyLeftRange.last.column.idx : cellMatrix.first.column.idx) || location.column.idx === cellMatrix.last.column.idx) {
        return cellMatrix.stickyLeftRange.width;
    } else if (cellMatrix.stickyLeftRange.first.column && location.column.idx >= cellMatrix.stickyLeftRange.first.column.idx && location.column.idx <= cellMatrix.stickyLeftRange.last.column.idx) {
        return leftStickyOffset;
    }
    return 0;
};

const calculatedYAxisOffset = (location: Location, state: State): number => {
    const cellMatrix = state.cellMatrix;
    const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
    const { top } = getReactGridOffsets(state);
    const topStickyOffset = getStickyOffset(scrollTop, top);

    if (location.row.idx > (cellMatrix.stickyTopRange.last.row ? cellMatrix.stickyTopRange.last.row.idx : cellMatrix.first.row.idx) || location.row.idx === cellMatrix.last.row.idx) {
        return cellMatrix.stickyTopRange.height;
    } else if (cellMatrix.stickyTopRange.first.row && location.row.idx >= cellMatrix.stickyTopRange.first.row.idx && location.row.idx <= cellMatrix.stickyTopRange.last.row.idx) {
        return topStickyOffset;
    }
    return 0;
};

const calculatedEditorPosition = (location: Location, state: State) => {
    const { offsetTop, offsetLeft } = getOffsetsOfElement(state.scrollableElement);
    const { scrollTop, scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
    const { top, left } = getReactGridOffsets(state);
    const topScrollableElement = getTopScrollableElement();
    const windowScrollY = state.scrollableElement !== topScrollableElement ? topScrollableElement.scrollY : 0;
    const windowScrollX = state.scrollableElement !== topScrollableElement ? topScrollableElement.scrollX : 0;
    return {
        left: location.column.left + calculatedXAxisOffset(location, state) + offsetLeft - windowScrollX + left - scrollLeft,
        top: location.row.top + calculatedYAxisOffset(location, state) + offsetTop - windowScrollY + top - scrollTop
    };
};

const positionReducer = (options: { state: State, location: Location }): any => {
    return calculatedEditorPosition(options.location, options.state);
}
