import { ProState } from "../Model/ProState";
import { getProActiveSelectedRange } from "./getProActiveSelectedRange";
import {
  Compatible,
  Cell,
  Location,
  tryAppendChangeHavingGroupId,
} from "../../core";
import { newLocation } from "./newLocation";

export function proPasteData(
  state: ProState,
  rows: Compatible<Cell>[][]
): ProState {
  const activeSelectedRange = getProActiveSelectedRange(state);
  if (rows.length === 1 && rows[0].length === 1) {
    // pasting single cell on active selected range
    activeSelectedRange.rows.forEach((row) =>
      activeSelectedRange.columns.forEach((column) => {
        state = tryAppendChangeHavingGroupId(
          state,
          newLocation(row, column),
          rows[0][0]
        ) as ProState;
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
          ) as ProState;
        }
      })
    );
    if (!lastLocation) {
      return state;
    }
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
