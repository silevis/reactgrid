import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { getCharFromKeyCode } from './getCharFromKeyCode';
import { isAlphaNumericKey } from './keyCodeCheckings';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';

import Select, { OptionProps, MenuProps } from 'react-select';
import { keyCodes } from '../Functions/keyCodes';

export type OptionType = {
    label: string;
    value: string;
}

export interface DropdownCell extends Cell {
    type: 'dropdown';
    selectedValue?: string;
    values: OptionType[];
    isDisabled?: boolean;
    isOpen?: boolean;
    inputValue?: string;
}

export class DropdownCellTemplate implements CellTemplate<DropdownCell> {

    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell> {
        let selectedValue: string | undefined;
        try {
            selectedValue = getCellProperty(uncertainCell, 'selectedValue', 'string')
        } catch {
            selectedValue = undefined;
        }
        const values = getCellProperty(uncertainCell, 'values', 'object');
        const value = selectedValue ? parseFloat(selectedValue) : NaN;
        let isDisabled = true;
        try {
            isDisabled = getCellProperty(uncertainCell, 'isDisabled', 'boolean');
        } catch {
            isDisabled = false;
        }
        let inputValue: string | undefined;
        try {
            inputValue = getCellProperty(uncertainCell, 'inputValue', 'string');
        } catch {
            inputValue = undefined;
        }
        let isOpen: boolean;
        try {
            isOpen = getCellProperty(uncertainCell, 'isOpen', 'boolean');
        } catch {
            isOpen = false;
        }
        const text = selectedValue || '';
        return { ...uncertainCell, selectedValue, text, value, values, isDisabled, isOpen, inputValue };
    }

    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        return this.getCompatibleCell({ ...cell, selectedValue: cellToMerge.selectedValue, isOpen: cellToMerge.isOpen, inputValue: cellToMerge.inputValue });
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean) {
        const isOpen = cell.isOpen ? 'open' : 'closed';
        return `${cell.className ? cell.className : ''}${isOpen}`;
    }

    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        if ((keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) && !shift) {
            return { cell: this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen }), enableEditMode: false };
        }
        const char = getCharFromKeyCode(keyCode, shift);
        if (!ctrl && !alt && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell({ ...cell, inputValue: shift ? char : char.toLowerCase(), isOpen: !cell.isOpen }), enableEditMode: false }
        return { cell, enableEditMode: false };
    }

    render(
        cell: Compatible<DropdownCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
    ): React.ReactNode {
        //eslint-disable-next-line
        const selectRef = React.useRef<any>(null);
        //eslint-disable-next-line
        const [inputValue, setInputValue] = React.useState<string | undefined>(cell.inputValue);
        //eslint-disable-next-line
        React.useEffect(() => {
            if (cell.isOpen && selectRef.current) {
                selectRef.current.focus();
                setInputValue(cell.inputValue);
            }
        }, [cell.isOpen, cell.inputValue]);

        return (
            <div
                style={{ width: '100%' }}
                onPointerDown={e => onCellChanged(this.getCompatibleCell({ ...cell, isOpen: true }), true)}
            >
                <Select
                    {...(cell.inputValue && {
                        inputValue,
                        defaultInputValue: inputValue,
                        onInputChange: e => setInputValue(e),
                    })}
                    isSearchable={true}
                    ref={selectRef}
                    {...(cell.isOpen !== undefined && { menuIsOpen: cell.isOpen })}
                    onMenuClose={() => onCellChanged(this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen, inputValue: undefined }), true)}
                    onMenuOpen={() => onCellChanged(this.getCompatibleCell({ ...cell, isOpen: true }), true)}
                    onChange={(e) => onCellChanged(this.getCompatibleCell({ ...cell, selectedValue: (e as { value: string }).value, isOpen: false, inputValue: undefined }), true)}
                    blurInputOnSelect={true}
                    defaultValue={cell.values.find(val => val.value === cell.selectedValue)}
                    isDisabled={cell.isDisabled}
                    options={cell.values}
                    onKeyDown={e => e.stopPropagation()}
                    components={{
                        Option: CustomOption,
                        Menu: CustomMenu,
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
                        singleValue: (provided) => ({
                            ...provided,
                            color: 'inherit'
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
            </div >
        );
    }
}

const CustomOption: React.FC<OptionProps<OptionType>> = ({ innerProps, label, isSelected, isFocused }) => (
    <div
        {...innerProps}
        onPointerDown={e => e.stopPropagation()}
        className={`dropdown-option${isSelected ? ' selected' : ''}${isFocused ? ' focused' : ''}`}
    >
        {label}
    </div>
);

const CustomMenu: React.FC<MenuProps<OptionType>> = ({ innerProps, children }) => (
    <div {...innerProps} className='dropdown-menu'>{children}</div>
);