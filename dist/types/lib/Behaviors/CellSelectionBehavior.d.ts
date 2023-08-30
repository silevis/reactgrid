import { Location, CellMatrix, PointerLocation } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { Behavior } from "../Model/Behavior";
import { State } from "../Model/State";
export declare class CellSelectionBehavior extends Behavior {
    handlePointerDown(event: PointerEvent, location: Location, state: State): State;
    handlePointerEnter(event: PointerEvent, location: Location, state: State): State;
    handlePointerUp(event: MouseEvent | PointerEvent, location: PointerLocation, state: State<CellMatrix, Behavior<MouseEvent | PointerEvent>>): State<CellMatrix, Behavior<MouseEvent | PointerEvent>>;
    handleContextMenu(event: PointerEvent, state: State): State;
}
