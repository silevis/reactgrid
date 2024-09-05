import React from 'react';
import { CellTemplate, Uncertain, Compatible, Cell, CellStyle, keyCodes } from "@silevis/reactgrid";

export interface ButtonCell extends Cell {
    type: 'button';
    text: string;
    onClick: () => void;
}

const blankFunction = () => { };

export const ButtonCellTemplate: CellTemplate<ButtonCell> = {
    getCompatibleCell(uncertainCell: Uncertain<ButtonCell>): Compatible<ButtonCell> {
        return {
            ...uncertainCell,
            text: uncertainCell.text || '',
            value: 0,
            onClick: uncertainCell.onClick || blankFunction
        }
    },
    handleKeyDown(cell: Compatible<ButtonCell>, keyCode: number) {
        if (keyCode === keyCodes.ENTER) {
            cell.onClick()
        }
        return { cell, enableEditMode: false }
    },
    render(cell: Compatible<ButtonCell>): React.ReactNode {
        return (
            <button
                className={cell.className}
                onPointerDown={e => e.stopPropagation()}
                onClick={cell.onClick}
            >
                {cell.text}
            </button>
        );
    },
}

export const getButtonCell = (text: string, onClick: () => void, style?: CellStyle, className?: string): ButtonCell => ({
    type: 'button',
    text,
    style,
    onClick,
    className
})
