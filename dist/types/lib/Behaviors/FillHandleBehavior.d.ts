import React from "react";
import { Location, Range } from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { State } from "../Model/State";
import { Behavior } from "../Model/Behavior";
export declare class FillHandleBehavior extends Behavior {
    private fillDirection;
    private fillRange?;
    handlePointerEnter(event: PointerEvent, location: Location, state: State): State;
    handlePointerUp(event: PointerEvent, location: Location, state: State): State;
    calculateXForRegressionFunction(y: number, a: number, b: number): number;
    findRegressionFunction(valuesX: number[], valuesY: number[]): {
        a: number;
        b: number;
    };
    sumArray(arr: number[]): number;
    multipleArrays(first: number[], second: number[]): number[];
    powerArray(arr: number[], power: number): number[];
    renderPanePart(state: State, pane: Range): React.ReactNode;
    private getFillDirection;
    private getFillRange;
    private fillRow;
    private fillColumn;
}
