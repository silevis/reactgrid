import * as React from 'react';
import { State, Location, Compatible, Cell, CellMatrix } from '../Model';
import { tryAppendChange } from '../Functions';
import { getScrollOfScrollableElement } from './../Functions/scrollHelpers';
import { getStickyOffset, getReactGridOffsets_DEPRECATED } from '../Functions/elementSizeHelpers';

export interface CellEditorOffset {
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

export interface PositionState<TState extends State = State> {
    state: TState;
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

export function getStickyLeftRangeWidth(cellMatrix: CellMatrix, location: Location): number | undefined {
    if (location.column.idx > (cellMatrix.ranges.stickyLeftRange.last.column ? cellMatrix.ranges.stickyLeftRange.last.column.idx : cellMatrix.first.column.idx) || location.column.idx === cellMatrix.last.column.idx) {
        return cellMatrix.ranges.stickyLeftRange.width;
    }
}

export function getStickyTopRangeWidth(cellMatrix: CellMatrix, location: Location): number | undefined {
    if (location.row.idx > (cellMatrix.ranges.stickyTopRange.last.row ? cellMatrix.ranges.stickyTopRange.last.row.idx : cellMatrix.first.row.idx) || location.row.idx === cellMatrix.last.row.idx) {
        return cellMatrix.ranges.stickyTopRange.height;
    }
}

export function getLeftStickyOffset(cellMatrix: CellMatrix, location: Location, state: State): number | undefined {
    if (cellMatrix.ranges.stickyLeftRange.first.column && location.column.idx >= cellMatrix.ranges.stickyLeftRange.first.column.idx
        && location.column.idx <= cellMatrix.ranges.stickyLeftRange.last.column.idx
    ) {
        const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
        const { left } = getReactGridOffsets_DEPRECATED(state);
        const leftStickyOffset = getStickyOffset(scrollLeft, left);
        return leftStickyOffset;
    }
}

export function getTopStickyOffset(cellMatrix: CellMatrix, location: Location, state: State): number | undefined {
    if (cellMatrix.ranges.stickyTopRange.first.row && location.row.idx >= cellMatrix.ranges.stickyTopRange.first.row.idx
        && location.row.idx <= cellMatrix.ranges.stickyTopRange.last.row.idx
    ) {
        const { scrollTop } = getScrollOfScrollableElement(state.scrollableElement);
        const { top } = getReactGridOffsets_DEPRECATED(state);
        const topStickyOffset = getStickyOffset(scrollTop, top);
        return topStickyOffset;
    }
}

export const cellEditorCalculator = (options: PositionState): CellEditorOffset => {
    const { state, location } = options;
    // TODO use rewrited version of getReactGridOffsets()
    const { left, top } = state.reactGridElement!.getBoundingClientRect();
    return {
        left: location.column.left + calculatedXAxisOffset(location, state) + left,
        top: location.row.top + calculatedYAxisOffset(location, state) + top
    };
}
