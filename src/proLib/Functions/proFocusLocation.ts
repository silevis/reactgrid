import { Location, focusLocation } from "../../core";
import { ProState } from "../Model/ProState";
import { resetSelection } from "./selectRange";

// TODO reset selection and context menu reset should be treated as a separated event
export function proFocusLocation(
  state: ProState,
  location: Location,
  applyResetSelection = true
): ProState {
  state = focusLocation(state, location) as ProState;

  if (applyResetSelection && state.focusedLocation) {
    // TODO is `location` really needed
    state = resetSelection(
      state,
      state.focusedLocation ? state.focusedLocation : location
    );
  }

  return {
    ...state,
    contextMenuPosition: { top: -1, left: -1 },
  };
}
