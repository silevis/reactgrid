import * as React from 'react';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
export interface NumberCell extends Cell {
    type: 'number';
    value: number;
    format?: Intl.NumberFormat;
    nanToZero?: boolean;
    hideZero?: boolean;
}
export declare class NumberCellTemplate implements CellTemplate<NumberCell> {
    getCompatibleCell(uncertainCell: Uncertain<NumberCell>): Compatible<NumberCell>;
    handleKeyDown(cell: Compatible<NumberCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<NumberCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<NumberCell>, cellToMerge: UncertainCompatible<NumberCell>): Compatible<NumberCell>;
    private getTextFromCharCode;
    getClassName(cell: Compatible<NumberCell>, isInEditMode: boolean): string;
    render(cell: Compatible<NumberCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<NumberCell>, commit: boolean) => void): React.ReactNode;
}
