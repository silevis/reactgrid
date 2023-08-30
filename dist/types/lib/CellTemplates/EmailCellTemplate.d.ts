import * as React from 'react';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
export interface EmailCell extends Cell {
    type: 'email';
    text: string;
    validator?: (text: string) => boolean;
    renderer?: (text: string) => React.ReactNode;
    errorMessage?: string;
}
export declare class EmailCellTemplate implements CellTemplate<EmailCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<EmailCell>): Compatible<EmailCell>;
    handleKeyDown(cell: Compatible<EmailCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string): {
        cell: Compatible<EmailCell>;
        enableEditMode: boolean;
    };
    handleCompositionEnd(cell: Compatible<EmailCell>, eventData: any): {
        cell: Compatible<EmailCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<EmailCell>, cellToMerge: UncertainCompatible<EmailCell>): Compatible<EmailCell>;
    getClassName(cell: Compatible<EmailCell>, isInEditMode: boolean): string;
    render(cell: Compatible<EmailCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<EmailCell>, commit: boolean) => void): React.ReactNode;
}
