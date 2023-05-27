import React from "react";
import { Direction, PointerLocation, Range } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { State } from "../Model/State";
import { Behavior } from "../Model/Behavior";
export declare class ResizeColumnBehavior extends Behavior {
    private resizedColumn;
    private initialLocation;
    autoScrollDirection: Direction;
    isInScrollableRange: boolean;
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State;
    renderPanePart(state: State, pane: Range): React.ReactNode;
    getLinePositionOffset(state: State): number;
}
