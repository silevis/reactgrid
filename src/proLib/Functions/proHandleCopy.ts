import { ProState } from "../Model/ProState";
import { getProDataToCopy } from "./getProDataToCopy";
import { copyDataCommands } from "../../core";
import { ClipboardEvent } from "../Model/domEventsTypes";
import { getProActiveSelectedRange } from "./getProActiveSelectedRange";

export function proHandleCopy(
  event: ClipboardEvent,
  state: ProState,
  removeValues = false
): ProState {
  const activeSelectedRange = getProActiveSelectedRange(state);
  if (!activeSelectedRange) {
    return state;
  }
  const { div } = getProDataToCopy(state, activeSelectedRange, removeValues);
  copyDataCommands(event, state, div);
  return { ...state, copyRange: activeSelectedRange };
}
