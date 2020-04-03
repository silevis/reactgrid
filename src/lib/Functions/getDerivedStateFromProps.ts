import { State, CellMatrix, ReactGridProps } from '../Model';
import { recalcVisibleRange } from '.';
import { defaultCellTemplates } from './defaultCellTemplates';
import { setInitialFocusLocation } from './setInitialFocusLocation';

/*
 * This function is still necessary, it will be hardly to reimplement with this 
 * guide https://en.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state
 * on our state management.
 * 
 * Currently, this function doesn't cause any unexpected behavior.
 */
export function getDerivedStateFromProps(props: ReactGridProps, state: State): State {
    if (state.props !== props) { // necessary 
        state = { ...state, props };
    }

    const dataHasChanged = !state.cellMatrix || props !== state.cellMatrix.props;

    if (dataHasChanged) { // necessary, mayby contsraint to not creating new, but just update
        state = { ...state, cellMatrix: new CellMatrix(props) };
    }

    if (!state.currentlyEditedCell && state.focusedLocation && state.cellMatrix.columns.length > 0 && dataHasChanged) { // keeps focus location in correct place 
        state = { ...state, focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) };
    }

    if (state.visibleRange && dataHasChanged) {
        state = recalcVisibleRange(state);
    }

    // TODO move to other place where cellMatrix is created
    state = setInitialFocusLocation(state, props.focusLocation);

    return {
        ...state,
        highlightLocations: props.highlights ?? [],
        cellTemplates: { ...defaultCellTemplates, ...props.customCellTemplates },
    }

}
