import { ReactGridProps } from './../Model';
import { State } from './../Model/State';
import { areLocationsEqual } from './../Functions/areLocationsEqual';
import { scrollIntoView } from '.';

export function componentDidUpdate(prevProps: ReactGridProps, prevState: State, state: State) {
    // maybe add scroll value to state and other like sticky offset, visible rg size
    // add logic that check is cell fully visible 
    if (state.focusedLocation && !areLocationsEqual(state.focusedLocation, prevState.focusedLocation)) {
        scrollIntoView(state, state.focusedLocation);
    }
}