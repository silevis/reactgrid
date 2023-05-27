import { Location } from '../Model/InternalModel';
import { State } from '../Model/State';
import { Cell, Compatible } from '../Model/PublicModel';
export declare function tryAppendChangeHavingGroupId(state: State, location: Location, cell: Compatible<Cell>): State;
