import { Location, Direction, GridRow, PointerLocation, CellMatrix } from "../../core";
import { Behavior } from "../Model/Behavior";
import { State } from "../Model/State";
import { PointerEvent } from "../Model/domEventsTypes";
export declare class RowSelectionBehavior extends Behavior {
    autoScrollDirection: Direction;
    initialRow: GridRow;
    handlePointerDown(event: PointerEvent, location: Location, state: State): State;
    handlePointerEnter(event: PointerEvent, location: Location, state: State): State;
    handlePointerUp(event: MouseEvent | PointerEvent, location: PointerLocation, state: State<CellMatrix, Behavior<MouseEvent | PointerEvent>>): State<CellMatrix, Behavior<MouseEvent | PointerEvent>>;
    handleContextMenu(event: PointerEvent, state: State): State;
}
