import { Cell, Compatible } from '../Model/PublicModel';
import { Location } from '../Model/InternalModel';
import { State } from '../Model/State';
export declare function tryAppendChange(state: State, location: Location, cell: Compatible<Cell>): State;
