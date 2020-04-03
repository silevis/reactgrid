import { State, KeyboardEvent } from '../Model';
export declare function handleKeyDown(state: State, event: KeyboardEvent): State;
export declare function focusCell(colIdx: number, rowIdx: number, state: State): State;
export declare function moveFocusLeft(state: State): State;
export declare function moveFocusRight(state: State): State;
export declare function moveFocusUp(state: State): State;
export declare function moveFocusDown(state: State): State;
