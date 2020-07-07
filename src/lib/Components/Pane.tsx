import * as React from 'react';
import { Range, Borders, State, Highlight } from '../Model';
import { CellFocus } from './CellFocus';
import { RowRenderer } from './RowRenderer';
import { CellRendererProps } from './CellRenderer';

export interface PaneProps {
    renderChildren: boolean;
    style: React.CSSProperties;
    className: string;
}

export interface RowsProps {
    state: State;
    range: Range;
    borders: Borders;
    paneUpdatePredicate: (prevProps: RowsProps, nextProps: RowsProps) => boolean;
    cellRenderer: React.FunctionComponent<CellRendererProps>;
}

export interface PaneContentProps<TState extends State = State> {
    state: TState;
    range: () => Range;
    borders: Borders;
    cellRenderer: React.FunctionComponent<CellRendererProps>;
    paneUpdatePredicate: (prevProps: RowsProps, nextProps: RowsProps) => boolean;
    children?: React.ReactNode;
}

export interface PaneContentChild<TState extends State = State> {
    state: TState;
    calculatedRange?: Range;
}

class PaneGridContent extends React.Component<RowsProps> {
    shouldComponentUpdate(nextProps: RowsProps) {
        return this.props.paneUpdatePredicate(this.props, nextProps);
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

export const PaneContent: React.FunctionComponent<PaneContentProps<State>> = props => {
    const { state, range, borders, cellRenderer, paneUpdatePredicate: shouldPaneGridContentUpdate, children } = props;

    const calculatedRange = range();

    const childProps: PaneContentChild = {
        state,
        calculatedRange
    };
    return (
        <>
            <PaneGridContent state={state} range={calculatedRange} borders={borders} cellRenderer={cellRenderer}
                paneUpdatePredicate={shouldPaneGridContentUpdate} />
            {renderHighlights(state, calculatedRange)}
            {state.focusedLocation && calculatedRange.contains(state.focusedLocation) &&
                <CellFocus location={state.focusedLocation} />}
            {children && React.Children.toArray(children).map(element => {
                return React.cloneElement(element as React.ReactElement<any>, childProps)
            })}
        </>
    )
}

const PaneContentWrapper: React.FunctionComponent<{ className: string, style: React.CSSProperties }> = props => {
    return <div className={`rg-pane ${props.className}`} style={{ ...props.style }}> {props.children} </div>
}