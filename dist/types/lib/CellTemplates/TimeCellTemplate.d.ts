import * as React from "react";
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from "../Model/PublicModel";
export interface TimeCell extends Cell {
    type: "time";
    time?: Date;
    format?: Intl.DateTimeFormat;
}
export declare class TimeCellTemplate implements CellTemplate<TimeCell> {
    static dayInMillis: number;
    static defaultDate: string;
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<TimeCell>): Compatible<TimeCell>;
    handleKeyDown(cell: Compatible<TimeCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string): {
        cell: Compatible<TimeCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<TimeCell>, cellToMerge: UncertainCompatible<TimeCell>): Compatible<TimeCell>;
    getClassName(cell: Compatible<TimeCell>, isInEditMode: boolean): string;
    render(cell: Compatible<TimeCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TimeCell>, commit: boolean) => void): React.ReactNode;
}
