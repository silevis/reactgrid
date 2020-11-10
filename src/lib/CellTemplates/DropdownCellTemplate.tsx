import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';

import Select, { OptionProps } from 'react-select';

export interface DropdownCell extends Cell {
    type: 'dropdown';
    currentValue: string;
    values: { label: string, value: string }[];
    isDisabled?: boolean;
    isOpen?: boolean;
}

export class DropdownCellTemplate implements CellTemplate<DropdownCell> {

    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell> {
        const currentValue = getCellProperty(uncertainCell, 'currentValue', 'string');
        const values = getCellProperty(uncertainCell, 'values', 'object');
        const value = parseFloat(currentValue);
        let isDisabled = true;
        try {
            isDisabled = getCellProperty(uncertainCell, 'isDisabled', 'boolean');
        } catch {
            isDisabled = false;
        }
        let isOpen: boolean;
        try {
            isOpen = getCellProperty(uncertainCell, 'isOpen', 'boolean');
        } catch {
            isOpen = false;
        }
        return { ...uncertainCell, currentValue, text: currentValue, value, values, isDisabled: isDisabled, isOpen };
    }

    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        return this.getCompatibleCell({ ...cell, currentValue: cellToMerge.currentValue, isOpen: cellToMerge.isOpen });
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean) {
        const isOpen = cell.isOpen ? 'open' : 'closed';
        return `${cell.className ? cell.className : ''}${isOpen}`;
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
        const selectRef = React.useRef<any>(null);

        React.useEffect(() => {
            if (cell.isOpen && selectRef.current) {
                selectRef.current.focus();
            }
        }, [cell.isOpen]);

        return (
            <div
                onPointerUp={e => e.stopPropagation()}
                style={{ width: '100%' }}
            >
                <Select
                    ref={selectRef}
                    {...(cell.isOpen !== undefined && { menuIsOpen: cell.isOpen })}
                    onMenuClose={() => onCellChanged(this.getCompatibleCell({ ...cell, isOpen: false }), true)}
                    onMenuOpen={() => onCellChanged(this.getCompatibleCell({ ...cell, isOpen: true }), true)}
                    onChange={(e) => {
                        selectRef.current.blur();
                        onCellChanged(this.getCompatibleCell({ ...cell, currentValue: (e as { value: string }).value, isOpen: false }), true);
                    }}
                    defaultValue={cell.values.find(val => val.value === cell.currentValue)}
                    // TODO move focus back to HiddenElement
                    onBlur={e => onCellChanged(this.getCompatibleCell({ ...cell, isOpen: false }), true)}
                    isDisabled={cell.isDisabled}
                    options={cell.values}
                    onKeyDown={e => e.stopPropagation()}
                    components={{
                        Option: CustomOption,
                    }}
                    styles={{
                        container: (provided) => ({
                            ...provided,
                            width: '100%',
                            height: '100%',
                        }),
                        control: (provided) => ({
                            ...provided,
                            border: 'none',
                            borderColor: 'transparent',
                            minHeight: '25px',
                            background: 'transparent',
                            boxShadow: 'none',
                        }),
                        indicatorsContainer: (provided) => ({
                            ...provided,
                            paddingTop: '0px',
                        }),
                        dropdownIndicator: (provided) => ({
                            ...provided,
                            padding: '0px 4px',
                        }),
                        indicatorSeparator: (provided) => ({
                            ...provided,
                            marginTop: '4px',
                            marginBottom: '4px',
                        }),
                        input: (provided) => ({
                            ...provided,
                            padding: 0,
                        }),
                        valueContainer: (provided) => ({
                            ...provided,
                            padding: '0 8px',
                        }),
                    }}
                />
            </div>
        );
    }
}

const CustomOption: React.FC<OptionProps<{ label: string; value: string; }>> = ({
    innerProps, label, isSelected, isFocused,
}) => (
        <div
            {...innerProps}
            onPointerUp={e => e.stopPropagation()}
            className={`dropdown-option${isSelected ? ' selected' : ''}${isFocused ? ' focused' : ''}`}
        >
            {label}
        </div>
    );