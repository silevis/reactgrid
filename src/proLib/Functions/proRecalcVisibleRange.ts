import { recalcVisibleRange, State } from "../../core";
import { ProState } from "../Model/ProState";

export function proRecalcVisibleRange(state: ProState): ProState {
  /**
   * Here was disabled virtual rendering by selecting whole cell matrix as visible range in a quick way,
   * TODO: remove all unused code e.g. getting scrollable element, calculating visible size etc...
   */
  return recalcVisibleRange(state) as ProState;
}
