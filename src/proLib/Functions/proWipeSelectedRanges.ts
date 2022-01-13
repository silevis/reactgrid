import { tryAppendChange, emptyCell } from "../../core";
import { ProState } from "../Model/ProState";

export function proWipeSelectedRanges(state: ProState): ProState {
  state.selectedRanges.forEach((range) =>
    range.rows.forEach((row) =>
      range.columns.forEach(
        (column) =>
          (state = tryAppendChange(
            state,
            { row, column },
            emptyCell
          ) as ProState)
      )
    )
  );
  return state;
}
