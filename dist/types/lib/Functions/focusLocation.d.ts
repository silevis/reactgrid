import { State } from '../Model/State';
import { Location } from '../Model/InternalModel';
import { keyCodes } from './keyCodes';
export declare function focusLocation(state: State, location: Location, applyResetSelection?: boolean, keyCode?: keyCodes): State;
