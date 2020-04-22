import { CellMatrix, ReactGridProps, State } from '../Model';
import { recalcVisibleRange } from '.';
import { defaultCellTemplates } from './defaultCellTemplates';
import { setInitialFocusLocation } from './setInitialFocusLocation';


export function getDerivedStateFromProps(props: ReactGridProps, state: State): State {

    const stateDeriverWithProps = stateDeriver(props);

    state = stateDeriverWithProps(state)(updateStateProps);

    const dataHasChanged = !state.cellMatrix || props !== state.cellMatrix.props;
    if (dataHasChanged) {
        state = stateDeriverWithProps(state)(updateCellMatrix);
    }

    state = stateDeriverWithProps(state)(updateFocusedLocation);

    if (dataHasChanged) {
        state = stateDeriverWithProps(state)(updateVisibleRange);
    }

    state = setInitialFocusLocation(state, props.focusLocation);

    state = stateDeriverWithProps(state)(appendCellTamplatesAndHighlights);

    return state;
}

export const stateDeriver = (props: ReactGridProps) => (state: State) => (fn: (props: ReactGridProps, state: State) => State) => fn(props, state);

export function updateStateProps(props: ReactGridProps, state: State): State {
    if (state.props !== props) {
        state = { ...state, props };
    }
    return state;
}

function updateCellMatrix(props: ReactGridProps, state: State): State {
    return { ...state, cellMatrix: new CellMatrix(props) };
}

export function updateFocusedLocation(props: ReactGridProps, state: State): State {
    if (state.cellMatrix.columns.length > 0 && state.focusedLocation && !state.currentlyEditedCell) {
        state = { ...state, focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) };
    }
    return state;
}

export function updateVisibleRange(props: ReactGridProps, state: State): State {
    if (state.visibleRange) {
        state = recalcVisibleRange(state);
    }
    return state;
}

export function appendCellTamplatesAndHighlights(props: ReactGridProps, state: State): State {
    return {
        ...state,
        cellTemplates: { ...defaultCellTemplates, ...props.customCellTemplates },
        highlightLocations: props.highlights || [],
    }
}
