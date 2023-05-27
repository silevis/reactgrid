import { Behavior } from "../Model/Behavior";
import { State } from "../Model/State";
import { PointerLocation, Direction } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
export declare class RowReorderBehavior extends Behavior {
    private initialRowIdx;
    private lastPossibleDropLocation?;
    private pointerOffset;
    private selectedIds;
    private position;
    autoScrollDirection: Direction;
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State;
    getShadowPosition(location: PointerLocation, state: State): number;
    getLastPossibleDropLocation(state: State, currentLocation: PointerLocation): PointerLocation | undefined;
    handlePointerUp(event: PointerEvent, location: PointerLocation, state: State): State;
    handleContextMenu(event: PointerEvent, state: State): State;
}
