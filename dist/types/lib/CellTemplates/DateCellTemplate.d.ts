import * as React from "react";
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from "../Model/PublicModel";
export interface DateCell extends Cell {
    type: "date";
    date?: Date;
    format?: Intl.DateTimeFormat;
}
export declare class DateCellTemplate implements CellTemplate<DateCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<DateCell>): Compatible<DateCell>;
    handleKeyDown(cell: Compatible<DateCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<DateCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<DateCell>, cellToMerge: UncertainCompatible<DateCell>): Compatible<DateCell>;
    getClassName(cell: Compatible<DateCell>, isInEditMode: boolean): string;
    render(cell: Compatible<DateCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DateCell>, commit: boolean) => void): React.ReactNode;
}
