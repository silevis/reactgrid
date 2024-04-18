import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { getCharFromKey } from './getCharFromKeyCode';
import { isAlphaNumericKey } from './keyCodeCheckings';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { keyCodes } from '../Functions/keyCodes';

import Select, { OptionProps, MenuProps } from 'react-select';
import { FC } from 'react';
import { disconnect } from 'process';

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

        const text = selectedValue || '';

        return { ...uncertainCell, selectedValue, text, value, values, isDisabled, inputValue };
    }

    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        // I use the text property as a selectedValue property because behaviors don't know about the selectedValue property
        // and instead throw an error when we try to access it.
        // Before merging, we also need to check if the incoming value is in the target values array, otherwise we set it to undefined.
        const selectedValueFromText = cell.values.some((val: any) => val.value === cellToMerge.text) ? cellToMerge.text : undefined;

        return this.getCompatibleCell({ ...cell, selectedValue: selectedValueFromText, inputValue: cellToMerge.inputValue });
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean): string {
        //const isOpen = cell.isOpen ? 'open' : 'closed';
        return `${cell.className}`;
    }
    // no cell.isOpen should affect here
    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        if ((keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) && !shift) {
            return { cell: this.getCompatibleCell({ ...cell}), enableEditMode: false };
            // set isMenuOpen false for Select
        }

        const char = getCharFromKey(key, shift);

        if (!ctrl && !alt && isAlphaNumericKey(keyCode) && !(shift && keyCode === keyCodes.SPACE))
            return { cell: this.getCompatibleCell({ ...cell, inputValue: char}), enableEditMode: false }

        return { cell, enableEditMode: false };
    }
    // no cell.isOpen should affect here
    handleCompositionEnd(cell: Compatible<DropdownCell>, eventData: any): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        return { cell: { ...cell, inputValue: eventData}, enableEditMode: false }
    }

    render(
        cell: Compatible<DropdownCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void
    ): React.ReactNode {

        return (
            <DropdownInput 
                onCellChanged={(cell) => onCellChanged(this.getCompatibleCell(cell), true)} 
                cell={cell} 
            />
        );
    }
}

interface DIProps {
    onCellChanged: (...args: any[]) => void;
    cell: Record<string, any>;
}

const DropdownInput: FC<DIProps> = ({ onCellChanged, cell}) => {
    const divRef = React.useRef<any>(null);
    const selectRef = React.useRef<any>(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState<string | undefined>(cell.inputValue);
    const selectedValue = React.useMemo<OptionType | undefined>(() => cell.values.find((val: any) => val.value === cell.text), [cell.text, cell.values]);
    
    React.useEffect(() => {
        if (isMenuOpen && selectRef.current) {
            selectRef.current.focus();
            setInputValue(cell.inputValue);
        }
    }, [isMenuOpen, cell.inputValue]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (divRef.current && !divRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePointerDown = (e : any) => {
        const {clientX} = e;
        const { top, left, width, lenghth } = divRef.current.getBoundingClientRect();
        console.log(clientX, left, width)
        const clickableRange = width * 0.6;
        if(!isMenuOpen && clientX- left > clickableRange){
            setIsMenuOpen(true)
            console.log("onPointerdown");
        }
    };

    const handleCellChanged = (e : OptionType) => {
        if (isMenuOpen){
            onCellChanged({ ...cell, selectedValue: (e as OptionType).value, inputValue: undefined })
            setIsMenuOpen(false)
            console.log("onChange")
        }
    }

    const handleKeyDown = (e : any) => {
        e.stopPropagation(); 

        if (e.key === "Escape" && isMenuOpen) {
            selectRef.current.blur();
            setIsMenuOpen(false)
            console.log("keydown")
            return onCellChanged({ ...cell, inputValue: undefined })
        }
    }

    return <div
        ref={divRef}
        style={{ width: '100%' }}
        onPointerDown={handlePointerDown}
    >
        <Select
            {...(cell.inputValue && {
                inputValue,
                defaultInputValue: inputValue,
                onInputChange: e => setInputValue(e),
            })}
            isSearchable={true}
            ref={selectRef}
            {...{menuIsOpen: isMenuOpen}}
            onChange={handleCellChanged}
            blurInputOnSelect={true}
            defaultValue={selectedValue}
            value={selectedValue}
            isDisabled={cell.isDisabled}
            options={cell.values}
            onKeyDown={handleKeyDown}
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