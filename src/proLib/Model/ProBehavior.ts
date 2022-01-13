import * as React from "react";
import { PointerLocation, Direction, Behavior, Range } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { ProState } from "./ProState";

export abstract class ProBehavior extends Behavior<PointerEvent | MouseEvent> {
  handlePointerMove(
    event: PointerEvent,
    location: PointerLocation,
    state: ProState
  ): ProState {
    return state;
  }

  handlePointerEnter(
    event: PointerEvent,
    location: PointerLocation,
    state: ProState
  ): ProState {
    return state;
  }

  handleContextMenu(
    event: PointerEvent | MouseEvent,
    state: ProState
  ): ProState {
    return state;
  }

  renderPanePart(state: ProState, pane: Range): React.ReactNode {
    return undefined;
  }

  autoScrollDirection: Direction = "both";
}
