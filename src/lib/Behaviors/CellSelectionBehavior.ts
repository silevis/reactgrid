import { focusLocation, PointerEvent } from '../Functions';
import { State, Location, Behavior } from '../Model';

export class CellSelectionBehavior extends Behavior {

    handlePointerDown(event: PointerEvent, location: Location, state: State): State {
        if ((event.target as HTMLDivElement).className === 'reactgrid-content') return state;
        return focusLocation(state, location);
    }

}

