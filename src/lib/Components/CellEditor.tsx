import * as React from 'react';
import { State, Location, Compatible, Cell, AbstractCellMatrix } from '../Model';
import { tryAppendChange, getTopScrollableElement, getScrollOfScrollableElement } from '../Functions';
import { getReactGridOffsets, getStickyOffset, getOffsetsOfElement } from '../Functions/elementSizeHelpers';


interface CellEditorOffset {
    top: number;
    left: number;
}

interface CellEditorProps {
    cellType: string;
    style: React.CSSProperties;
}
export interface CellEditorRendererProps {
    state: State;
    positionCalculator: (options: PositionState) => any;
}

export interface PositionState {
    state: State;
    location: Location;
}

export const CellEditorRenderer: React.FunctionComponent<CellEditorRendererProps> = props => {
    const { state, positionCalculator } = props;
    const { currentlyEditedCell, disableFloatingCellEditor } = state;
    const location = state.focusedLocation!;

    const [position, dispatch] = React.useReducer(positionCalculator, { state, location }); // used to lock cell editor position
    React.useLayoutEffect(() => dispatch(), []);

    if (!currentlyEditedCell) { // prevents to unexpectly opening cell editor on cypress
        return null;
    }

    const cellTemplate = state.cellTemplates![currentlyEditedCell.type];
    // TODO custom style
    //const customStyle = cellTemplate.getCustomStyle ? cellTemplate.getCustomStyle(cell.data, true) : {};
    return <CellEditor
        cellType={currentlyEditedCell.type}
        style={{
            top: position.top && (position.top + (disableFloatingCellEditor ? 0 : -1)),
            left: position.left && (position.left + (disableFloatingCellEditor ? 0 : -1)),
            height: location.row.height + 1,
            width: location.column.width + 1,
            position: disableFloatingCellEditor ? 'absolute' : 'fixed'
        }}
    >
        {cellTemplate.render(state.currentlyEditedCell!, true, (cell: Compatible<Cell>, commit: boolean) => {
            state.currentlyEditedCell = commit ? undefined : cell;
            if (commit) state.update(state => tryAppendChange(state, location, cell));
        })}
    </CellEditor>
};

const CellEditor: React.FunctionComponent<CellEditorProps> = props => {
    const { style, cellType, children } = props;
    return (
        <div
            className={`rg-celleditor rg-${cellType}-celleditor`}
            data-cy="rg-celleditor"
            style={{
                ...style
                //...customStyle,
            }}
        >
            {children}
        </div>
    )
}

const calculatedXAxisOffset = (location: Location, state: State) => {
    const cellMatrix = state.cellMatrix;
    const offset: number | undefined = getStickyLeftRangeWidth(cellMatrix, location) || getLeftStickyOffset(cellMatrix, location, state);
    if (offset) {
        return offset;
    }
    return 0;
}

const calculatedYAxisOffset = (location: Location, state: State): number => {
    const cellMatrix = state.cellMatrix;
    const offset: number | undefined = getStickyTopRangeWidth(cellMatrix, location) || getTopStickyOffset(cellMatrix, location, state);
    if (offset) {
        return offset;
    }
    return 0;
}

export function getStickyLeftRangeWidth(cellMatrix: AbstractCellMatrix, location: Location): number | undefined {
    if (location.column.idx > (cellMatrix.stickyLeftRange.last.column ? cellMatrix.stickyLeftRange.last.column.idx : cellMatrix.first.column.idx) || location.column.idx === cellMatrix.last.column.idx) {
        return cellMatrix.stickyLeftRange.width;
    }
}

export function getStickyTopRangeWidth(cellMatrix: AbstractCellMatrix, location: Location): number | undefined {
    if (location.row.idx > (cellMatrix.stickyTopRange.last.row ? cellMatrix.stickyTopRange.last.row.idx : cellMatrix.first.row.idx) || location.row.idx === cellMatrix.last.row.idx) {
        return cellMatrix.stickyTopRange.height;
    }
}

export function getLeftStickyOffset(cellMatrix: AbstractCellMatrix, location: Location, state: State): number | undefined {
    if (cellMatrix.stickyLeftRange.first.column && location.column.idx >= cellMatrix.stickyLeftRange.first.column.idx
        && location.column.idx <= cellMatrix.stickyLeftRange.last.column.idx
    ) {
        const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
        const { left } = getReactGridOffsets(state);
        const leftStickyOffset = getStickyOffset(scrollLeft, left);
        return leftStickyOffset;
    }
}

export function getTopStickyOffset(cellMatrix: AbstractCellMatrix, location: Location, state: State): number | undefined {
    if (cellMatrix.stickyTopRange.first.row && location.row.idx >= cellMatrix.stickyTopRange.first.row.idx
        && location.row.idx <= cellMatrix.stickyTopRange.last.row.idx
    ) {
        const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
        const { top } = getReactGridOffsets(state);
        const topStickyOffset = getStickyOffset(scrollTop, top);
        return topStickyOffset;
    }
}

export const cellEditorCalculator = (options: PositionState): CellEditorOffset => {
    const { state, location } = options;
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
}
