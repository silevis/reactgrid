import * as React from "react";
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from "../Model/PublicModel";
export interface NumberCell extends Cell {
    type: "number";
    value: number;
    format?: Intl.NumberFormat;
    validator?: (value: number) => boolean;
    nanToZero?: boolean;
    hideZero?: boolean;
    errorMessage?: string;
}
export declare class NumberCellTemplate implements CellTemplate<NumberCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<NumberCell>): Compatible<NumberCell>;
    handleKeyDown(cell: Compatible<NumberCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<NumberCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<NumberCell>, cellToMerge: UncertainCompatible<NumberCell>): Compatible<NumberCell>;
    private getTextFromCharCode;
    getClassName(cell: Compatible<NumberCell>, isInEditMode: boolean): string;
    render(cell: Compatible<NumberCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<NumberCell>, commit: boolean) => void): React.ReactNode;
}
