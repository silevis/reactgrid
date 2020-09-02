import { State, Compatible, Cell, Range } from '../Model';
import { tryAppendChangeHavingGroupId } from './tryAppendChangeHavingGroupId';

export function pasteData(state: State, activeSelectedRange: Range, cellToPaste: Compatible<Cell>): State {
    const location = { row: activeSelectedRange.first.row, column: activeSelectedRange.first.column };
    return tryAppendChangeHavingGroupId(state, location, cellToPaste);
}