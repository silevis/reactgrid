import { GridColumn, Location, Direction } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { Behavior } from "../Model/Behavior";
import { State } from "../Model/State";
export declare class ColumnSelectionBehavior extends Behavior {
    autoScrollDirection: Direction;
    initialColumn: GridColumn;
    handlePointerDown(event: PointerEvent, location: Location, state: State): State;
    handlePointerEnter(event: PointerEvent, location: Location, state: State): State;
    handleContextMenu(event: PointerEvent, state: State): State;
}
