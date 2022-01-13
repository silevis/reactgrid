import { GridColumn, Location, isSelectionKey, Direction } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { ProBehavior } from "../Model/ProBehavior";
import { ProState } from "../Model/ProState";
import {
  unSelectOneColumn,
  selectMultipleColumns,
  selectOneColumn,
} from "../Functions/selectRange";
import { proFocusLocation } from "../Functions/proFocusLocation";
import { handleContextMenu } from "../Functions/handleContextMenu";

export class ColumnSelectionBehavior extends ProBehavior {
  autoScrollDirection: Direction = "horizontal";
  initialColumn!: GridColumn;

  handlePointerDown(
    event: PointerEvent,
    location: Location,
    state: ProState
  ): ProState {
    this.initialColumn = location.column;
    if (
      isSelectionKey(event) &&
      state.selectionMode === "column" &&
      state.selectedIds.some((id) => id === location.column.columnId)
    ) {
      state = unSelectOneColumn(state, location.column);
    } else if (event.shiftKey && state.focusedLocation) {
      state = selectMultipleColumns(
        state,
        state.focusedLocation.column,
        location.column,
        isSelectionKey(event)
      );
    } else {
      state = proFocusLocation(state, location, false);
      state = selectOneColumn(state, location.column, isSelectionKey(event));
    }
    return state;
  }

  handlePointerEnter(
    event: PointerEvent,
    location: Location,
    state: ProState
  ): ProState {
    return selectMultipleColumns(
      state,
      this.initialColumn,
      location.column,
      isSelectionKey(event)
    );
  }

  handleContextMenu(event: PointerEvent, state: ProState): ProState {
    return handleContextMenu(event, state);
  }
}
