import { State } from '../Model/State';
import { ReactGridProps, CellLocation } from '../Model/PublicModel';
import { CellMatrixBuilder } from '../Model/CellMatrixBuilder';
import { defaultCellTemplates } from './defaultCellTemplates';
import { focusLocation } from './focusLocation';
import { recalcVisibleRange } from './recalcVisibleRange';


export function getDerivedStateFromProps(props: ReactGridProps, state: State): State {

    const stateDeriverWithProps = stateDeriver(props);

    const hasHighlightsChanged = highlightsHasChanged(props, state);

    if (hasHighlightsChanged) {
        state = stateDeriverWithProps(state)(appendHighlights);
    }

    state = stateDeriverWithProps(state)(updateStateProps);

    state = stateDeriverWithProps(state)(appendCellTemplates);

    state = stateDeriverWithProps(state)(appendGroupIdRender);

    const hasChanged = dataHasChanged(props, state);

    if (hasChanged) {
        state = stateDeriverWithProps(state)(updateCellMatrix);
    }

    state = stateDeriverWithProps(state)(updateFocusedLocation);

    if (hasChanged) {
        state = stateDeriverWithProps(state)(updateVisibleRange);
    }
    state = stateDeriverWithProps(state)(setInitialFocusLocation);

    if (areFocusesDiff(props, state)) {
        state = stateDeriverWithProps(state)(setFocusLocation);
    }

    return state;
}

export const areFocusesDiff = (props: ReactGridProps, state: State): boolean => {
    return props.focusLocation?.columnId !== state.focusedLocation?.column.columnId
        || props.focusLocation?.rowId !== state.focusedLocation?.row.rowId;
}

export const stateDeriver = (props: ReactGridProps) => (state: State) => (fn: (props: ReactGridProps, state: State) => State) => fn(props, state);

export const dataHasChanged = (props: ReactGridProps, state: State) => !state.cellMatrix || props !== state.cellMatrix.props;

export const highlightsHasChanged = (props: ReactGridProps, state: State) => props.highlights !== state.props?.highlights;

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

export function appendCellTemplates(props: ReactGridProps, state: State): State {
    return {
        ...state,
        cellTemplates: { ...defaultCellTemplates, ...props.customCellTemplates }
    }
}

export function appendGroupIdRender(props: ReactGridProps, state: State): State {
    return {
        ...state,
        enableGroupIdRender: !!props.enableGroupIdRender
    }
}

export function appendHighlights(props: ReactGridProps, state: State): State {
    const highlights = props.highlights?.filter(highlight => state.cellMatrix.rowIndexLookup[highlight.rowId] !== undefined &&
        state.cellMatrix.columnIndexLookup[highlight.columnId] !== undefined
    );
    if (highlights?.length !== props.highlights?.length) {
        console.error('Data inconsistency in ReactGrid "highlights" prop');
    }
    return {
        ...state,
        highlightLocations: highlights || [],
    }
}

export function setInitialFocusLocation(props: ReactGridProps, state: State): State {
    const locationToFocus = props.initialFocusLocation;
    if (locationToFocus && !state.focusedLocation) {
        if (isLocationToFocusCorrect(state, locationToFocus)) {
            console.error('Data inconsistency in ReactGrid "initialFocusLocation" prop');
            return state;
        }
        const location = state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId);
        return focusLocation(state, location);
    }
    return state;
}

export function setFocusLocation(props: ReactGridProps, state: State): State {
    const locationToFocus = props.focusLocation;
    if (locationToFocus) {
        if (isLocationToFocusCorrect(state, locationToFocus)) {
            console.error('Data inconsistency in ReactGrid "focusLocation" prop');
            return state;
        }
        const location = state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId);
        return focusLocation(state, location)
    }
    return state;
}

function isLocationToFocusCorrect(state: State, location: CellLocation) {
    return !(state.cellMatrix.columnIndexLookup[location.columnId] !== undefined)
        || !(state.cellMatrix.rowIndexLookup[location.rowId] !== undefined)
}