import { tryAppendChange } from '.';
export function pasteData(state, activeSelectedRange, cell) {
    var location = { row: activeSelectedRange.first.row, column: activeSelectedRange.first.column };
    return tryAppendChange(state, location, cell);
}
