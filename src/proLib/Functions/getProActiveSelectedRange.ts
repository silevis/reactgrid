import { ProState } from "../Model/ProState";
import { Range } from "../../core";

export function getProActiveSelectedRange(state: ProState): Range {
  return state.selectedRanges[state.activeSelectedRangeIdx];
}
