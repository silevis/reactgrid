import * as React from 'react';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
export interface CheckboxCell extends Cell {
    type: 'checkbox';
    checked: boolean;
    checkedText?: string;
    uncheckedText?: string;
}
export declare class CheckboxCellTemplate implements CellTemplate<CheckboxCell> {
    getCompatibleCell(uncertainCell: Uncertain<CheckboxCell>): Compatible<CheckboxCell>;
    handleKeyDown(cell: Compatible<CheckboxCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<CheckboxCell>;
        enableEditMode: boolean;
    };
    private toggleCheckboxCell;
    update(cell: Compatible<CheckboxCell>, cellToMerge: UncertainCompatible<CheckboxCell>): Compatible<CheckboxCell>;
    getClassName(cell: Compatible<CheckboxCell>): string;
    render(cell: Compatible<CheckboxCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<CheckboxCell>, commit: boolean) => void): React.ReactNode;
}
