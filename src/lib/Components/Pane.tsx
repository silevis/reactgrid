import * as React from 'react';
import { Range } from '../Model/Range';
import { State } from '../Model/State';
import { Borders } from '../Model/InternalModel';
import { Highlight } from '../Model/PublicModel';
import { CellFocus, CellHighlight } from './CellFocus';
import { RowRenderer } from './RowRenderer';
import { CellRendererProps } from './CellRenderer';
import { isMobileDevice } from '../Functions/isMobileDevice';

export interface PaneProps {
    renderChildren: boolean;
    style: React.CSSProperties;
    className: string;
}

export interface RowsProps {
    state: State;
    range: Range;
    borders: Borders;
    cellRenderer: React.FC<CellRendererProps>;
}

export interface PaneContentProps<TState extends State = State> {
    state: TState;
    range: () => Range;
    borders: Borders;
    cellRenderer: React.FC<CellRendererProps>;
    children?: (state: TState, range: Range) => React.ReactNode;
}

function shouldMemoPaneGridContent(prevProps: RowsProps, nextProps: RowsProps): boolean {
    const { state: prevState } = prevProps;
    const { state: nextState } = nextProps;
    if (prevState.focusedLocation && nextState.focusedLocation
        && prevState.currentlyEditedCell === nextState.currentlyEditedCell // used for opening cell editor in cell
    ) {
        if (prevState.focusedLocation.column.columnId !== nextState.focusedLocation.column.columnId
            || prevState.focusedLocation.row.rowId !== nextState.focusedLocation.row.rowId)
            return false;
    } else {
        return false; // needed when select range by touch after first focus
    }
    return !(prevState.visibleRange !== nextState.visibleRange || prevState.cellMatrix.props !== nextState.cellMatrix.props);
}

export const PaneGridContent: React.NamedExoticComponent<RowsProps> = React.memo(({ range, state, borders, cellRenderer }) => <>
    {range.rows.map(row => <RowRenderer key={row.rowId} state={state} row={row} columns={range.columns}
        forceUpdate={true} cellRenderer={cellRenderer}
        borders={{
            ...borders,
            top: borders.top && row.top === 0,
            bottom: (borders.bottom && row.idx === range.last.row.idx) || !(state.cellMatrix.scrollableRange.last.row.idx === row.idx)
        }} />
    )}
</>, shouldMemoPaneGridContent);

PaneGridContent.displayName = 'PaneGridContent';

function renderHighlights(state: State, range: Range) {
    return state.highlightLocations.map((highlight: Highlight, id: number) => {
        try {
            const location = state.cellMatrix.getLocationById(highlight.rowId, highlight.columnId);
            return location && range.contains(location) &&
                <CellHighlight key={id} location={location} state={state} borderColor={highlight.borderColor} />;
        } catch (error) {
            console.error(`Cell location fot found while rendering highlights at: ${(error as Error).message}`);
            return null;
        }
    });
}

export const Pane: React.FC<PaneProps> = ({ className, style, renderChildren, children }) => {
    if (!style.width || !style.height) {
        return null;
    } else {
        return <PaneContentWrapper className={className} style={style}> {renderChildren && children} </PaneContentWrapper>
    }
};

export const PaneContent: React.FC<PaneContentProps<State>> = (props) => {
    const { state, range, borders, cellRenderer, children } = props;

    const calculatedRange = range();

    return (
        <>
            <PaneGridContent state={state} range={calculatedRange} borders={borders} cellRenderer={cellRenderer} />
            {renderHighlights(state, calculatedRange)}
            {state.focusedLocation && !(state.currentlyEditedCell && isMobileDevice()) && calculatedRange.contains(state.focusedLocation) &&
                <CellFocus location={state.focusedLocation} />}
            {children && children(state, calculatedRange)}
        </>
    )
}

const PaneContentWrapper: React.FC<{ className: string, style: React.CSSProperties }> = props => {
    return <div className={`rg-pane ${props.className}`} style={props.style}> {props.children} </div>
}
