import { State, Compatible, Cell, Range } from '../Model';
import { tryAppendChange } from '.';

export function pasteData(state: State, activeSelectedRange: Range, cell: Compatible<Cell>): State {
    const location = { row: activeSelectedRange.first.row, column: activeSelectedRange.first.column };
    return tryAppendChange(state, location, cell)
}

