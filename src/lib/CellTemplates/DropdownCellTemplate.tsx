import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { getCharFromKey } from './getCharFromKeyCode';
import { isAlphaNumericKey } from './keyCodeCheckings';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { keyCodes } from '../Functions/keyCodes';

import Select, { OptionProps, MenuProps } from 'react-select';
import { FC } from 'react';

export type OptionType = {
    label: string;
    value: string;
    isDisabled?: boolean;
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
        // I use the text property as a selectedValue property because behaviors don't know about the selectedValue property
        // and instead throw an error when we try to access it.
        // Before merging, we also need to check if the incoming value is in the target values array, otherwise we set it to undefined.
        const selectedValueFromText = cell.values.some((val: any) => val.value === cellToMerge.text) ? cellToMerge.text : undefined;

        return this.getCompatibleCell({ ...cell, selectedValue: selectedValueFromText, isOpen: cellToMerge.isOpen, inputValue: cellToMerge.inputValue });
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean): string {
        const isOpen = cell.isOpen ? 'open' : 'closed';
        return `${cell.className ? cell.className : ''}${isOpen}`;
    }

    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        if ((keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) && !shift) {
            return { cell: this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen }), enableEditMode: false };
        }

        const char = getCharFromKey(key, shift);

        if (!ctrl && !alt && isAlphaNumericKey(keyCode) && !(shift && keyCode === keyCodes.SPACE))
            return { cell: this.getCompatibleCell({ ...cell, inputValue: char, isOpen: !cell.isOpen }), enableEditMode: false }

        return { cell, enableEditMode: false };
    }

    handleCompositionEnd(cell: Compatible<DropdownCell>, eventData: any): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        return { cell: { ...cell, inputValue: eventData, isOpen: !cell.isOpen }, enableEditMode: false }
    }

    render(
        cell: Compatible<DropdownCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
    ): React.ReactNode {
        return (
            <DropdownInput onCellChanged={(cell) => onCellChanged(this.getCompatibleCell(cell), true)} cell={cell} />
        );
    }
}

interface DIProps {
    onCellChanged: (...args: any[]) => void;
    cell: Record<string, any>;

}

const DropdownInput: FC<DIProps> = ({ onCellChanged, cell }) => {

    const selectRef = React.useRef<any>(null);

    const [inputValue, setInputValue] = React.useState<string | undefined>(cell.inputValue);
    const selectedValue = React.useMemo<OptionType | undefined>(() => cell.values.find((val: any) => val.value === cell.text), [cell.text, cell.values]);

    React.useEffect(() => {
        if (cell.isOpen && selectRef.current) {
            selectRef.current.focus();
            setInputValue(cell.inputValue);
        }
    }, [cell.isOpen, cell.inputValue]);

    return <div
        style={{ width: '100%' }}
        onPointerDown={e => onCellChanged({ ...cell, isOpen: true })}
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
            onMenuClose={() => onCellChanged({ ...cell, isOpen: !cell.isOpen, inputValue: undefined })}
            onMenuOpen={() => onCellChanged({ ...cell, isOpen: true })}
            onChange={(e) => onCellChanged({ ...cell, selectedValue: (e as OptionType).value, isOpen: false, inputValue: undefined })}
            blurInputOnSelect={true}
            defaultValue={selectedValue}
            value={selectedValue}
            isDisabled={cell.isDisabled}
            options={cell.values}
            onKeyDown={e => {
                e.stopPropagation(); 

                if (e.key === "Escape") {
                    selectRef.current.blur();
                    return onCellChanged({ ...cell, isOpen: false, inputValue: undefined })
                }
            }}
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
}

const CustomOption: React.FC<OptionProps<OptionType, false>> = ({ innerProps, label, isSelected, isFocused, isDisabled }) => (
    <div
        {...innerProps}
        onPointerDown={e => e.stopPropagation()}
        className={`rg-dropdown-option${isSelected ? ' selected' : ''}${isFocused ? ' focused' : ''}${isDisabled ? ' disabled' : ''}`}
    >
        {label}
    </div>
);

const CustomMenu: React.FC<MenuProps<OptionType, false>> = ({ innerProps, children }) => (
    <div {...innerProps} className='rg-dropdown-menu'>{children}</div>
);
