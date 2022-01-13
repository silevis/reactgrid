import {
  Location,
  isSelectionKey,
  isOnClickableArea,
  getCompatibleCellAndTemplate,
} from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import {
  updateActiveSelectedRange,
  selectRange,
} from "../Functions/selectRange";
import { ProBehavior } from "../Model/ProBehavior";
import { ProState } from "../Model/ProState";
import { proFocusLocation } from "../Functions/proFocusLocation";
import { handleContextMenu } from "../Functions/handleContextMenu";

export class ProCellSelectionBehavior extends ProBehavior {
  handlePointerDown(
    event: PointerEvent,
    location: Location,
    state: ProState
  ): ProState {
    if ((event.target as HTMLDivElement).className === "reactgrid-content")
      return state;
    if (state.enableRangeSelection && event.shiftKey && state.focusedLocation) {
      const range = state.cellMatrix.getRange(state.focusedLocation, location);
      if (isSelectionKey(event) && state.selectionMode === "range") {
        return updateActiveSelectedRange(state, range);
      } else {
        return selectRange(state, range, false);
      }
    } else if (state.enableRangeSelection && isSelectionKey(event)) {
      const pointedRangeIdx = state.selectedRanges.findIndex((range) =>
        range.contains(location)
      );
      const pointedRange = state.selectedRanges[pointedRangeIdx];
      const { cellTemplate } = getCompatibleCellAndTemplate(state, location);
      if (pointedRange) {
        state = proFocusLocation(state, location, false);
        state = { ...state, activeSelectedRangeIdx: pointedRangeIdx };
      } else if (!cellTemplate.isFocusable) {
        const range = state.cellMatrix.getRange(location, location);
        state = selectRange(state, range, true);
        state = proFocusLocation(state, location, false);
      }
    } else {
      state = proFocusLocation(state, location);
    }
    return state;
  }

  handlePointerEnter(
    event: PointerEvent,
    location: Location,
    state: ProState
  ): ProState {
    if (
      !state.enableRangeSelection ||
      !state.focusedLocation ||
      (event.target as HTMLDivElement).className === "reactgrid-content"
    ) {
      // fix for FF scroll issue
      return state;
    }
    const range = state.cellMatrix.getRange(state.focusedLocation, location);
    if (state.selectionMode === "range" && isOnClickableArea(event, state)) {
      return updateActiveSelectedRange(state, range);
    } else {
      return selectRange(state, range, false);
    }
  }

  handleContextMenu(event: PointerEvent, state: ProState): ProState {
    return handleContextMenu(event, state);
  }
}
