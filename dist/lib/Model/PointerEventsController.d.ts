import { State, PointerEvent } from '.';
import { AbstractPointerEventsController } from '../Model/AbstractPointerEventsController';
export declare class PointerEventsController extends AbstractPointerEventsController {
    handlePointerDown: (event: PointerEvent, state: State<import("./CellMatrix").CellMatrix<import("./CellMatrix").StickyRanges, import("./CellMatrix").CellMatrixProps>, import("./Behavior").Behavior>) => State<import("./CellMatrix").CellMatrix<import("./CellMatrix").StickyRanges, import("./CellMatrix").CellMatrixProps>, import("./Behavior").Behavior>;
    private handlePointerUp;
}
