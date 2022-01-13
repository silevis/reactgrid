import { Location, isSelectionKey, Direction, GridRow } from "../../core";
import { ProBehavior } from "../Model/ProBehavior";
import { ProState } from "../Model/ProState";
import {
  unSelectOneRow,
  selectMultipleRows,
  selectOneRow,
} from "../Functions/selectRange";
import { proFocusLocation } from "../Functions/proFocusLocation";
import { handleContextMenu } from "../Functions/handleContextMenu";
import { PointerEvent } from "../Model/domEventsTypes";

export class RowSelectionBehavior extends ProBehavior {
  autoScrollDirection: Direction = "vertical";
  initialRow!: GridRow;

  handlePointerDown(
    event: PointerEvent,
    location: Location,
    state: ProState
  ): ProState {
    this.initialRow = location.row;
    if (
      isSelectionKey(event) &&
      state.selectionMode === "row" &&
      state.selectedIds.some((id) => id === location.row.rowId)
    ) {
      state = unSelectOneRow(state, location.row);
    } else if (event.shiftKey && state.focusedLocation) {
      state = selectMultipleRows(
        state,
        state.focusedLocation.row,
        location.row,
        isSelectionKey(event)
      );
    } else {
      state = proFocusLocation(state, location, false);
      state = selectOneRow(state, location.row, isSelectionKey(event));
    }
    return state;
  }

  handlePointerEnter(
    event: PointerEvent,
    location: Location,
    state: ProState
  ): ProState {
    return selectMultipleRows(
      state,
      this.initialRow,
      location.row,
      isSelectionKey(event)
    );
  }

  handleContextMenu(event: PointerEvent, state: ProState): ProState {
    return handleContextMenu(event, state);
  }
}
