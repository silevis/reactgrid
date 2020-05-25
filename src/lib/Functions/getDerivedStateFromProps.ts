import { ReactGridProps, State } from '../Model';
import { recalcVisibleRange, focusLocation } from '.';
import { defaultCellTemplates } from './defaultCellTemplates';
import { CellMatrixBuilder } from '../Model/CellMatrixBuilder';


export function getDerivedStateFromProps(props: ReactGridProps, state: State): State {

    const stateDeriverWithProps = stateDeriver(props);

    state = stateDeriverWithProps(state)(updateStateProps);

    state = stateDeriverWithProps(state)(appendCellTemplatesAndHighlights);

    const hasChanged = dataHasChanged(props, state);
    if (hasChanged) {
        state = stateDeriverWithProps(state)(updateCellMatrix);
    }

    state = stateDeriverWithProps(state)(updateFocusedLocation);

    if (hasChanged) {
        state = stateDeriverWithProps(state)(updateVisibleRange);
    }
    state = stateDeriverWithProps(state)(setInitialFocusLocation);

    state = stateDeriverWithProps(state)(setFocusLocation);

    return state;
}

export const stateDeriver = (props: ReactGridProps) => (state: State) => (fn: (props: ReactGridProps, state: State) => State) => fn(props, state);

export const dataHasChanged = (props: ReactGridProps, state: State) => !state.cellMatrix || props !== state.cellMatrix.props;

export function updateStateProps(props: ReactGridProps, state: State): State {
    if (state.props !== props) {
        state = { ...state, props };
    }
    return state;
}

function updateCellMatrix(props: ReactGridProps, state: State): State {
    const builder = new CellMatrixBuilder();
    return {
        ...state,
        cellMatrix: builder.setProps(props).fillRowsAndCols().fillSticky().fillScrollableRange()
            .setEdgeLocations().getCellMatrix()
    };
}

export function updateFocusedLocation(props: ReactGridProps, state: State): State {
    if (state.cellMatrix.columns.length > 0 && state.focusedLocation && !state.currentlyEditedCell) {
        state = { ...state, focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) };
    }
    return state;
}

function updateVisibleRange(props: ReactGridProps, state: State): State {
    if (state.visibleRange) {
        state = recalcVisibleRange(state);
    }
    return state;
}

export function appendCellTemplatesAndHighlights(props: ReactGridProps, state: State): State {
    return {
        ...state,
        highlightLocations: props.highlights ?? [],
        cellTemplates: { ...defaultCellTemplates, ...props.customCellTemplates },
    }
}

export function setInitialFocusLocation(props: ReactGridProps, state: State): State {
    const locationToFocus = props.initialFocusLocation;
    if (locationToFocus && !state.focusedLocation) {
        return focusLocation(state, state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId));
    }
    return state;
}

export function setFocusLocation(props: ReactGridProps, state: State): State {
    const locationToFocus = props.focusLocation;
    if (locationToFocus) {
        const location = state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId);
        return focusLocation(state, location)
    }
    return state;
}