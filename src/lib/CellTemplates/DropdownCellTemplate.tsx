import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import Select from 'react-select';

export interface DropdownCell extends Cell {
    type: 'dropdown';
    currentValue: string;
    values: { label: string, value: string }[];
    disabled?: boolean;
    isOpen?: boolean;
}

export class DropdownCellTemplate implements CellTemplate<DropdownCell> {

    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell> {
        const currentValue = getCellProperty(uncertainCell, 'currentValue', 'string');
        const values = getCellProperty(uncertainCell, 'values', 'object');
        const value = parseFloat(currentValue);
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
        return { ...uncertainCell, currentValue, text: currentValue, value, values, disabled, isOpen };
    }

    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        return this.getCompatibleCell({ ...cell, currentValue: cellToMerge.currentValue, isOpen: cellToMerge.isOpen });
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean) {
        const isOpen = cell.isOpen ? 'open' : 'closed';
        return `${cell.className ? cell.className : ''} ${isOpen}`;
    }

    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        if ((keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) && !shift) {
            return { cell: { ...cell, isOpen: !cell.isOpen }, enableEditMode: false };
        }
        return { cell, enableEditMode: false };
    }

    render(
        cell: Compatible<DropdownCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
    ): React.ReactNode {
        const ref = React.useRef<any>(null);

        React.useEffect(() => {
            if (cell.isOpen && ref.current) {
                ref.current.focus();
            }
        }, [cell.isOpen]);

        return (
            <div
                onPointerDown={e => {
                    // TODO fix focusing cell
                    e.stopPropagation();
                }}
                style={{ width: '100%' }}
            >
                <Select
                    ref={ref}
                    {...(cell.isOpen !== undefined && { menuIsOpen: cell.isOpen })}
                    onMenuClose={() => onCellChanged(this.getCompatibleCell({ ...cell, isOpen: false }), true)}
                    onMenuOpen={() => onCellChanged(this.getCompatibleCell({ ...cell, isOpen: true }), true)}
                    onChange={(e) => {
                        ref.current.blur();
                        onCellChanged(this.getCompatibleCell({ ...cell, currentValue: (e as { value: string }).value, isOpen: !cell.isOpen }), true);
                    }}
                    defaultValue={cell.values.find(val => val.value === cell.currentValue)}
                    onBlur={e => {
                        onCellChanged(this.getCompatibleCell({ ...cell, isOpen: false }), true);
                        // TODO move focus back to HiddenElement

                    }}
                    options={cell.values}
                    onKeyDown={e => e.stopPropagation()}
                    styles={{
                        container: (provided, state) => ({
                            ...provided,
                            width: '100%',
                            height: '100%',
                        }),
                        control: (provided, state) => ({
                            ...provided,
                            border: 'none',
                            borderColor: 'transparent',
                            minHeight: '25px',
                            background: 'transparent',
                            boxShadow: 'none',
                        }),
                        indicatorsContainer: (provided, state) => ({
                            ...provided,
                            paddingTop: '0px',
                        }),
                        dropdownIndicator: (provided, state) => ({
                            ...provided,
                            padding: '0px 4px',
                        }),
                        input: (provided, state) => ({
                            ...provided,
                            padding: 0
                        }),
                        valueContainer: (provided, state) => ({
                            ...provided,
                            padding: '0 8px'
                        }),
                    }}
                />
            </div>
        );
    }
}