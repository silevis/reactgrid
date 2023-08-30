import * as React from 'react';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
export interface TextCell extends Cell {
    type: 'text';
    text: string;
    placeholder?: string;
    validator?: (text: string) => boolean;
    renderer?: (text: string) => React.ReactNode;
    errorMessage?: string;
}
export declare class TextCellTemplate implements CellTemplate<TextCell> {
    getCompatibleCell(uncertainCell: Uncertain<TextCell>): Compatible<TextCell>;
    update(cell: Compatible<TextCell>, cellToMerge: UncertainCompatible<TextCell>): Compatible<TextCell>;
    handleKeyDown(cell: Compatible<TextCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<TextCell>;
        enableEditMode: boolean;
    };
    getClassName(cell: Compatible<TextCell>, isInEditMode: boolean): string;
    render(cell: Compatible<TextCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TextCell>, commit: boolean) => void): React.ReactNode;
}
