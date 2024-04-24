import * as React from 'react';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
export type OptionType = {
    label: string;
    value: string;
    isDisabled?: boolean;
};
export interface DropdownCell extends Cell {
    type: 'dropdown';
    selectedValue?: string;
    values: OptionType[];
    isDisabled?: boolean;
    isOpen?: boolean;
    inputValue?: string;
}
export declare class DropdownCellTemplate implements CellTemplate<DropdownCell> {
    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell>;
    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell>;
    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean): string;
    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<DropdownCell>;
        enableEditMode: boolean;
    };
    handleCompositionEnd(cell: Compatible<DropdownCell>, eventData: any): {
        cell: Compatible<DropdownCell>;
        enableEditMode: boolean;
    };
    render(cell: Compatible<DropdownCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void): React.ReactNode;
}
