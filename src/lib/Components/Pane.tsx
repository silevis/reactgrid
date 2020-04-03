import * as React from 'react';
import { Range, Borders, State, Highlight } from '../Model';
import { CellFocus } from './CellFocus';
import { RowRenderer } from './RowRenderer';

export interface PaneProps {
    renderAsFrame: boolean;
    state: State,
    style: React.CSSProperties,
    range: () => Range,
    borders: Borders,
    className: string
}

interface RowsProps {
    state: State;
    range: Range;
    borders: Borders;
}

class GridContent extends React.Component<RowsProps> {
    shouldComponentUpdate(nextProps: RowsProps) {
        if (this.props.state.focusedLocation && nextProps.state.focusedLocation) {
            if (this.props.state.focusedLocation.column.columnId !== nextProps.state.focusedLocation.column.columnId || this.props.state.focusedLocation.row.rowId !== nextProps.state.focusedLocation.row.rowId)
                // && // needed when select range by touch
                //nextProps.state.lastKeyCode !== keyCodes.ENTER && nextProps.state.lastKeyCode !== keyCodes.TAB) // improved performance during moving focus inside range
                return true;
        } else {
            return true; // needed when select range by touch after first focus
        }
        return this.props.state.visibleRange !== nextProps.state.visibleRange || this.props.state.cellMatrix.props !== nextProps.state.cellMatrix.props;
    }

    render() {
        return (
            <>
                {this.props.range.rows.map((row) => <RowRenderer key={row.rowId} state={this.props.state} row={row} columns={this.props.range.columns} forceUpdate={true} borders={{ ...this.props.borders, top: this.props.borders.top && row.top === 0, bottom: this.props.borders.bottom && row.idx === this.props.range.last.row.idx }} />)}
                {this.props.range.rows.map((row) => <div key={row.rowId} className="rg-separator-line rg-separator-line-row" style={{ top: row.top, height: row.height, }} />)}
                {this.props.range.columns.map((col) => <div key={col.columnId} className="rg-separator-line rg-separator-line-col" style={{ left: col.left, width: col.width }} />)}
            </>
        );
    }
}

function renderHighlights(props: PaneProps, range: Range) {
    return props.state.highlightLocations.map((highlight: Highlight, id: number) => {
        const location = props.state.cellMatrix.getLocationById(highlight.rowId, highlight.columnId);
        return location && range.contains(location) && <CellFocus key={id} location={location} borderColor={highlight.borderColor} isHighlight />;
    });
}

export const Pane: React.FunctionComponent<PaneProps> = props => {
    if (!props.style.width || !props.style.height) {
        return null;
    } else if (!props.renderAsFrame) {
        return <PaneContentWrapper className={props.className} style={props.style} />
    } else {
        const range = props.range();
        return (
            <PaneContentWrapper className={props.className} style={props.style} >
                <GridContent state={props.state} range={range} borders={props.borders} />
                {props.state.highlightLocations && renderHighlights(props, range)}
                {props.state.focusedLocation && range.contains(props.state.focusedLocation) && <CellFocus location={props.state.focusedLocation} borderColor={``} />}
            </PaneContentWrapper>
        )
    };
};

const PaneContentWrapper: React.FunctionComponent<{ className: string, style: React.CSSProperties }> = props => {
    return <div className={`rg-pane ${props.className}`} style={{ ...props.style }}>{props.children}</div>
}