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
        const isOpen = cell.isOpen ? 'open' : 'closed';
        return `${cell.className ? cell.className : ''} ${isOpen}`;
    }

    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        if (keyCode === keyCodes.SPACE && !shift) {
            return { cell: { ...cell, isOpen: !cell.isOpen }, enableEditMode: false };
        }
        return { cell, enableEditMode: false };
    }

    render(
        cell: Compatible<DropdownCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
    ): React.ReactNode {
        const dropdownRef = React.useRef<HTMLDivElement>(null);
        const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, { initialState: cell.isOpen || false, onCellChanged, cell });
        return (<>
            <button
                onPointerDown={e => {
                    setIsActive(() => !isActive);
                    onCellChanged(this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen }), true)
                }}
            >
                <span>{cell.key}</span>
            </button>
            {cell.isOpen &&
                <div
                    ref={dropdownRef}
                    onKeyDown={e => e.stopPropagation()}
                >
                    <ul>
                        {cell.values.map((value, idx) => <li key={idx}
                            className={`${cell.values[idx] === cell.key && 'selected'}`}
                            onPointerDown={e => {
                                e.stopPropagation();
                                setIsActive(false);
                                onCellChanged(this.getCompatibleCell({ ...cell, isOpen: false, key: cell.values[idx] }), true);
                            }}>
                            {value}
                        </li>)}
                    </ul>
                </div >
            }
        </>);
    }
}

function useDetectOutsideClick(
    el: React.RefObject<HTMLDivElement>,
    options: {
        initialState: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void,
        cell: Compatible<DropdownCell>
    }
) {
    const [isActive, setIsActive] = React.useState<any>(options.initialState);
    React.useEffect(() => {
        const pageClickEvent = (e: any) => {
            if (el.current !== null && !el.current.contains(e.target)) {
                options.onCellChanged({ ...options.cell, isOpen: !options.cell.isOpen }, true);
                setIsActive(!isActive);
            }
        };
        if (isActive) {
            window.addEventListener('pointerdown', pageClickEvent);
        }
        return () => window.removeEventListener('pointerdown', pageClickEvent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, el]);
    return [isActive, setIsActive];
}
