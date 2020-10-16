import { focusLocation } from '../Functions/focusLocation';
import { Behavior } from '../Model/Behavior';
import { State } from '../Model/State';
import { Location } from '../Model/InternalModel';
import { PointerEvent } from '../Model/domEventsTypes';

export class CellSelectionBehavior extends Behavior {

    handlePointerDown(event: PointerEvent, location: Location, state: State): State {
        if ((event.target as HTMLDivElement).className === 'reactgrid-content') return state;
        return focusLocation(state, location);
    }

}
