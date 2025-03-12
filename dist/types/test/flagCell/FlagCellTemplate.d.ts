import * as React from 'react';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible } from '../../reactgrid';
import './flag-cell-style.scss';
export interface FlagCell extends Cell {
    type: 'flag';
    text: string;
}
export declare class FlagCellTemplate implements CellTemplate<FlagCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<FlagCell>): Compatible<FlagCell>;
    handleKeyDown(cell: Compatible<FlagCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<FlagCell>;
        enableEditMode: boolean;
    };
    handleCompositionEnd(cell: Compatible<FlagCell>, eventData: any): {
        cell: Compatible<FlagCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<FlagCell>, cellToMerge: UncertainCompatible<FlagCell>): Compatible<FlagCell>;
    render(cell: Compatible<FlagCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<FlagCell>, commit: boolean) => void): React.ReactNode;
}
