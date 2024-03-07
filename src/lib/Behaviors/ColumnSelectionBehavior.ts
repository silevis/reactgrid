import { GridColumn, Location, isSelectionKey, Direction } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { Behavior } from "../Model/Behavior";
import { State } from "../Model/State";
import {
  unSelectOneColumn,
  selectMultipleColumns,
  selectOneColumn,
} from "../Functions/selectRange";
import { focusLocation } from "../Functions/focusLocation";
import { handleContextMenu } from "../Functions/handleContextMenu";

export class ColumnSelectionBehavior extends Behavior {
  autoScrollDirection: Direction = "horizontal";
  initialColumn!: GridColumn;

  handlePointerDown(
    event: PointerEvent,
    location: Location,
    state: State
  ): State {
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
      state = focusLocation(state, location, false);
      state = selectOneColumn(state, location.column, isSelectionKey(event));
    }
    return state;
  }

  handlePointerEnter(
    event: PointerEvent,
    location: Location,
    state: State
  ): State {
    return selectMultipleColumns(
      state,
      this.initialColumn,
      location.column,
      isSelectionKey(event)
    );
  }

  handlePointerUp(
    event: MouseEvent | PointerEvent,
    location: Location,
    state: State
  ): State {
    if (
      state.props?.onSelectionChanging &&
      !state.props.onSelectionChanging(state.selectedRanges)
    ) {
      // Cancel the latest selection
      const filteredRanges = [...state.selectedRanges].filter(
        (_, index) => index !== state.activeSelectedRangeIdx
      );

      return {
        ...state,
        selectedRanges: filteredRanges,
        activeSelectedRangeIdx: filteredRanges.length - 1,
      };
    }

    state.props?.onSelectionChanged &&
      state.props.onSelectionChanged(state.selectedRanges);

    return state;
  }

  handleContextMenu(event: PointerEvent, state: State): State {
    return handleContextMenu(event, state);
  }
}
