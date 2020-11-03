import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';

export interface DropdownCell extends Cell {
    type: 'dropdown';
    key: string;
    values: string[];
    disabled?: boolean;
    isOpen?: boolean;
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
        let isOpen: boolean;
        try {
            isOpen = getCellProperty(uncertainCell, 'isOpen', 'boolean');
        } catch {
            isOpen = false;
        }
        return { ...uncertainCell, key, text: key, value, values, disabled, isOpen };
    }

    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        return this.getCompatibleCell({ ...cell, key: cellToMerge.key, isOpen: cellToMerge.isOpen });
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean) {
        return cell.className ? cell.className : '';
    }

    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        if (keyCode === keyCodes.SPACE && !shift) {
            return { cell: { ...cell, isOpen: true }, enableEditMode: false };
        }
        return { cell, enableEditMode: false };
    }

    render(
        cell: Compatible<DropdownCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
    ): React.ReactNode {
        const dropdownRef = React.useRef<any>(null);
        console.log(cell.isOpen);

        React.useEffect(() => {
            const pageClickEvent = (e: any) => {
                if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
                    onCellChanged(this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen }), true);
                }
            };

            if (cell.isOpen) {
                window.addEventListener('pointerdown', pageClickEvent);
            }

            return () => window.removeEventListener('pointerdown', pageClickEvent);

        }, [cell.isOpen, cell, onCellChanged]);

        return (<>
            <button className="menu-trigger"
                onPointerDown={e => {
                    e.stopPropagation();
                    onCellChanged(this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen }), true);
                }}
            >
                <span>{cell.key}</span>
            </button>
            <div
                ref={dropdownRef}
                className={`dropdown-container ${cell.isOpen ? 'open' : 'closed'}`}
                onPointerDown={e => e.stopPropagation()}
            >
                <ul>
                    {cell.values.map((value, idx) => <li key={idx} onPointerDown={e => {
                        // setIsActive(false);
                        onCellChanged(this.getCompatibleCell({ ...cell, isOpen: false, key: cell.values[idx] }), true)
                    }}>
                        {value}
                    </li>)}
                </ul>
            </div >
        </>);
    }
}