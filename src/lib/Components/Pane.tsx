import * as React from 'react';
import { Range, Borders, State, Highlight, SliceDirection } from '../Model';
import { CellFocus } from './CellFocus';
import { RowRenderer } from './RowRenderer';
import { CellRendererProps } from './CellRenderer';

export interface PaneProps {
    renderChildren: boolean;
    style: React.CSSProperties;
    className: string;
}

interface RowsProps {
    state: State;
    range: Range;
    borders: Borders;
    cellRenderer: React.FunctionComponent<CellRendererProps>;
}

export interface PaneContentProps<R extends object = Range> {
    state: State;
    range: R | boolean;
    rangeToSlice: R | boolean;
    direction: SliceDirection;
    borders: Borders;
    cellRenderer: React.FunctionComponent<CellRendererProps>;
}

class PaneGridContent extends React.Component<RowsProps> {
    shouldComponentUpdate(nextProps: RowsProps) {
        const { state } = this.props;
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

    render() {
        const { range, state, borders, cellRenderer } = this.props;
        return (
            <>
                {range.rows.map((row) => <RowRenderer key={row.rowId} state={state} row={row} columns={range.columns} forceUpdate={true} cellRenderer={cellRenderer}
                    borders={{ ...borders, top: borders.top && row.top === 0, bottom: borders.bottom && row.idx === range.last.row.idx }} />)}
                {range.rows.map((row) => <div key={row.rowId} className="rg-separator-line rg-separator-line-row" style={{ top: row.top, height: row.height, }} />)}
                {range.columns.map((col) => <div key={col.columnId} className="rg-separator-line rg-separator-line-col" style={{ left: col.left, width: col.width }} />)}
            </>
        );
    }
}

function renderHighlights(state: State, range: Range) {
    return state.highlightLocations.map((highlight: Highlight, id: number) => {
        const location = state.cellMatrix.getLocationById(highlight.rowId, highlight.columnId);
        return location && range.contains(location) &&
            <CellFocus key={id} location={location} borderColor={highlight.borderColor} isHighlight />;
    });
}

export const Pane: React.FunctionComponent<PaneProps> = props => {
    const { className, style, renderChildren, children } = props;
    if (!style.width || !style.height) {
        return null;
    } else {
        return <PaneContentWrapper className={className} style={style}> {renderChildren && children} </PaneContentWrapper>
    }
};

export const PaneContent: React.FunctionComponent<PaneContentProps> = props => {
    const { state, range, rangeToSlice, direction, borders, cellRenderer, children } = props;

    if (!(range instanceof Range) || !(rangeToSlice instanceof Range)) { // TODO cleanup
        return null;
    }

    const rng = range.slice(rangeToSlice, direction);
    return (
        <>
            <PaneGridContent state={state} range={rng} borders={borders} cellRenderer={cellRenderer} />
            {children && React.Children.toArray(children).map(element => {
                return React.cloneElement(element as React.ReactElement<any>, { range: rng })
            })}
            {state.highlightLocations && renderHighlights(state, rng)}
            {state.focusedLocation && rng.contains(state.focusedLocation) &&
                <CellFocus location={state.focusedLocation} borderColor={state.props?.focusLocation?.color} />}
        </>
    )
}

const PaneContentWrapper: React.FunctionComponent<{ className: string, style: React.CSSProperties }> = props => {
    return <div className={`rg-pane ${props.className}`} style={{ ...props.style }}> {props.children} </div>
}