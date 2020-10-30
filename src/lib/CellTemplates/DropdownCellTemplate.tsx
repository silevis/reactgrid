import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';

export interface DropdownCell extends Cell {
    type: 'dropdown';
    key: string;
    values: string[];
    disabled?: boolean;
}

export class DropdownCellTemplate implements CellTemplate<DropdownCell> {

    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell> {
        const key = getCellProperty(uncertainCell, 'key', 'string');
        const values = getCellProperty(uncertainCell, 'values', 'object');
        const value = parseFloat(key);
        let disabled = true;
        try {
            disabled = getCellProperty(uncertainCell, 'disabled', 'boolean');
        } catch {
            disabled = false;
        }
        return { ...uncertainCell, key, text: key, value, values, disabled }
    }

    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        return this.getCompatibleCell({ ...cell, key: cellToMerge.key });
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean) {
        return cell.className ? cell.className : '';
    }
    //TODO open dropdown cell templete with space
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
                defaultValue={cell.text}
                onChange={e => onCellChanged(this.getCompatibleCell({ ...cell, key: e.currentTarget.value }), true)}
            >
                {cell.values.map((value, idx) => <option key={idx} value={value}>{value}</option>)}
            </select>
        );
    }
}