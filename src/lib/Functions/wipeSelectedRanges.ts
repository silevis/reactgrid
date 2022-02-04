import { State } from '../Model/State';
import { emptyCell } from './emptyCell';
import { tryAppendChange } from './tryAppendChange';

export function wipeSelectedRanges(state: State): State {
    state.selectedRanges.forEach((range) =>
    range.rows.forEach((row) =>
      range.columns.forEach(
        (column) =>
          (state = tryAppendChange(
            state,
            { row, column },
            emptyCell
          ) as State)
      )
    )
  );
  return state;
}