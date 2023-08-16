import { Cell, Compatible } from "../Model/PublicModel";
import { State } from "../Model/State";
import { Location } from "../Model/InternalModel";
import { tryAppendChangeHavingGroupId } from "./tryAppendChangeHavingGroupId";
import { getActiveSelectedRange } from "./getActiveSelectedRange";
import { newLocation } from "./newLocation";

export function pasteData(state: State, rows: Compatible<Cell>[][]): State {
  const activeSelectedRange = getActiveSelectedRange(state);
  if (rows.length === 1 && rows[0].length === 1) {
    // pasting single cell on active selected range
    activeSelectedRange.rows.forEach((row) =>
      activeSelectedRange.columns.forEach((column) => {
        state = tryAppendChangeHavingGroupId(
          state, 
          newLocation(row, column),
          rows[0][0]
        ) as State;
      })
    );
  } else {
    let lastLocation: Location | undefined;
    const cellMatrix = state.cellMatrix;
    rows.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        const rowIdx = activeSelectedRange.first.row.idx + ri;
        const columnIdx = activeSelectedRange.first.column.idx + ci;
        if (
          rowIdx <= cellMatrix.last.row.idx &&
          columnIdx <= cellMatrix.last.column.idx
        ) {
          lastLocation = cellMatrix.getLocation(rowIdx, columnIdx);
          state = tryAppendChangeHavingGroupId(
            state,
            lastLocation,
            cell
          ) as State;
        }
      })
    );
    if (!lastLocation) {
      return state;
    }

    const newRange = cellMatrix.getRange(activeSelectedRange.first, lastLocation);

    if (state?.props?.onSelectionChanging && !state.props.onSelectionChanging([newRange])) {
      return state;
    }

    state?.props?.onSelectionChanged && state.props.onSelectionChanged([newRange]);

    return {
      ...state,
      selectedRanges: [
        cellMatrix.getRange(activeSelectedRange.first, lastLocation),
      ],
      activeSelectedRangeIdx: 0,
    };
  }
  return state;
}
