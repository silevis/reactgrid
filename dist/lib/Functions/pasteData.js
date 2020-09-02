import { tryAppendChangeHavingGroupId } from './tryAppendChangeHavingGroupId';
export function pasteData(state, activeSelectedRange, cellToPaste) {
    var location = { row: activeSelectedRange.first.row, column: activeSelectedRange.first.column };
    return tryAppendChangeHavingGroupId(state, location, cellToPaste);
}
