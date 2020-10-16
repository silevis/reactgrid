import { Cell, Compatible } from '../Model/PublicModel';
import { State } from '../Model/State';
import { Range } from '../Model/Range';
export declare function pasteData(state: State, activeSelectedRange: Range, cellToPaste: Compatible<Cell>): State;
