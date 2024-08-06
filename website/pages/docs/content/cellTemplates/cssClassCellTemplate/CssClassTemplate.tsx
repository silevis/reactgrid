import * as React from 'react';
import { CellTemplate, Cell, Compatible, Uncertain, getCellProperty } from '@silevis/reactgrid';
import './css-class-style.scss';

export interface CssClassCell extends Cell {
    type: 'cssClass';
    value: number;
    className?: string;
}

export class CssClassCellTemplate implements CellTemplate<CssClassCell> {

    getCompatibleCell(uncertainCell: Uncertain<CssClassCell>): Compatible<CssClassCell> {
        const value = getCellProperty(uncertainCell, 'value', 'number');
        const text = value.toString();
        return { ...uncertainCell, value, text };
    }

    handleKeyDown(cell: Compatible<CssClassCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<CssClassCell>, enableEditMode: boolean } {
        return { cell, enableEditMode: false }
    }

    getClassName(cell: Compatible<CssClassCell>, isInEditMode: boolean) {
        return cell.className ? cell.className : '';
    }

    render(cell: Compatible<CssClassCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<CssClassCell>, commit: boolean) => void): React.ReactNode {
        if (!isInEditMode) return cell.value
    }

}