import React from 'react';
import { CellTemplate, Uncertain, Compatible, Cell, CellStyle, UncertainCompatible } from "@silevis/reactgrid";

export interface DropdownCell extends Cell {
    type: 'dropdown';
    values: string[];
    text: string;
    disabled?: boolean;
}

export const DropdownCellTemplate: CellTemplate<DropdownCell> = {
    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell> {
        return {
            ...uncertainCell,
            text: uncertainCell.text || '',
            value: uncertainCell.values?.length || 0,
            values: uncertainCell.values || [],
            disabled: uncertainCell.disabled,
        }
    },
    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        return this.getCompatibleCell({ ...cell, text: cellToMerge.text });
    },
    render(
        cell: Compatible<DropdownCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
    ): React.ReactNode {
        return (
            <select
                disabled={cell.disabled}
                className={cell.className}
                onPointerDown={e => e.stopPropagation()}
                value={cell.text}
                onChange={e =>
                    onCellChanged(
                        this.getCompatibleCell({ ...cell, text: e.currentTarget.value }),
                        true
                    )
                }
            >
                {cell.values.map((value, idx) => <option key={idx} value={value}>{value}</option>)}
            </select>
        );
    },
}

export const getDropdownCell = (text: string, values: string[], disabled?: boolean, style?: CellStyle, className?: string): DropdownCell => ({
    type: 'dropdown',
    text,
    style,
    values,
    disabled,
    className
})
