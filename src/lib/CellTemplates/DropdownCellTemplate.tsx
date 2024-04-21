/*
import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { getCharFromKey } from './getCharFromKeyCode';
import { isAlphaNumericKey } from './keyCodeCheckings';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { keyCodes } from '../Functions/keyCodes';

import Select, { OptionProps, MenuProps, components } from 'react-select';
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

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

const DropdownInput: FC<DIProps> = ({ onCellChanged, cell}) => {
    const divRef = React.useRef<any>(null);
    const selectRef = React.useRef<any>(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState<string>("");
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
        //console.log(clientX, left, width)
        //const clickableRange = width * 0.6;
        const clickableRange = 0
        if(!isMenuOpen && clientX- left > clickableRange){
            setIsMenuOpen(true)
            //console.log("onPointerdown");
        }
    };

    const handleCellChanged = (e : any) => {
        if (isMenuOpen){
            setInputValue(e.value)
            onCellChanged({ ...cell, selectedValue: (e as OptionType).value, inputValue: undefined })
            setIsMenuOpen(false)
        }
        //console.log("onChange")
    }

    const handleInputChange = (inputValue:string) => {
        //console.log("handleInputChange")
        setInputValue(inputValue)
    }

    const handleSelectKeyDown = (e : any) => {
        e.stopPropagation(); 
        if (e.key === "Escape" && isMenuOpen) {
            selectRef.current.blur();
            setIsMenuOpen(false)
            //console.log("keydown")
            return onCellChanged({ ...cell, inputValue: undefined })
        }
    }

    return <div
        ref={divRef}
        style={{ width: '100%' }}
        onPointerDown={handlePointerDown}
    >
        <Select
            //{...(cell.inputValue && {
            //    inputValue,
            //    defaultInputValue: inputValue,
            //    onInputChange: e => setInputValue(e),
            //})}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            ref={selectRef}
            {...{menuIsOpen: isMenuOpen}}
            onChange={handleCellChanged}
            //blurInputOnSelect={true}
            defaultValue={selectedValue}
            value={selectedValue}
            isDisabled={cell.isDisabled}
            options={cell.values}
            onKeyDown={handleSelectKeyDown}
            components={{
                Option: CustomOption,
                Menu: CustomMenu,
                Input
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

*/

import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { isAlphaNumericKey, isNavigationKey } from './keyCodeCheckings'
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { getCharFromKey } from './getCharFromKeyCode';
import { DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { FC } from 'react';

export type OptionType = {
    label: string;
    value: string;
    isDisabled?: boolean;
}

export interface DropdownCell extends Cell {
    type: 'dropdown';
    text: string,
    placeholder?: string;
    validator?: (text: string) => boolean,
    renderer?: (text: string) => React.ReactNode,
    errorMessage?: string
    values: OptionType[];
    isDisabled?: boolean;
}

export class DropdownCellTemplate implements CellTemplate<DropdownCell> {
    private wasEscKeyPressed = false;

    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        let placeholder: string | undefined;
        try {
            placeholder = getCellProperty(uncertainCell, 'placeholder', 'string');
        } catch {
            placeholder = '';
        }
        const value = parseFloat(text); // TODO more advanced parsing for all text based cells


        const values = getCellProperty(uncertainCell, 'values', 'object');

        let isDisabled = true;
        try {
            isDisabled = getCellProperty(uncertainCell, 'isDisabled', 'boolean');
        } catch {
            isDisabled = false;
        }

        return { ...uncertainCell, text, value, values, placeholder };
    }

    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell> {
        return this.getCompatibleCell({ ...cell, text: cellToMerge.text, placeholder: cellToMerge.placeholder })
    }

    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        const char = getCharFromKey(key, shift);

        if (!ctrl && !alt && isAlphaNumericKey(keyCode) && !(shift && keyCode === keyCodes.SPACE))
            return { cell: this.getCompatibleCell({ ...cell, text: char }), enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }
    
    handleCompositionEnd(cell: Compatible<DropdownCell>, eventData: any): { cell: Compatible<DropdownCell>, enableEditMode: boolean } {
        return { cell: { ...cell, text: eventData }, enableEditMode: true }
    }

    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean): string {
        const isValid = cell.validator ? cell.validator(cell.text) : true;
        const className = cell.className ? cell.className : '';
        return `${isValid ? 'valid' : 'rg-invalid'} ${cell.placeholder && cell.text === '' ? 'placeholder' : ''} ${className}`;
    }

    render(cell: Compatible<DropdownCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode) {
            const isValid = cell.validator ? cell.validator(cell.text) : true;
            const cellText = cell.text || cell.placeholder || '';
            const textToDisplay = !isValid && cell.errorMessage ? cell.errorMessage : cellText;
            return (
                <>
                    {cell.renderer ? cell.renderer(textToDisplay) : textToDisplay}
                    <DropdownInput
                        onCellChanged={(cell) => onCellChanged(this.getCompatibleCell(cell), true)} 
                        cell={cell} 
                    />
                </>
                );
        }

        return (
            <input
                style={{width: '70%'}}
                ref={input => {
                    if (input) {
                        input.focus();
                        input.setSelectionRange(input.value.length, input.value.length);
                    }
                }}
                defaultValue={cell.text}
                onChange={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), false)}
                onBlur={e => { onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), !this.wasEscKeyPressed); this.wasEscKeyPressed = false; }}
                onCopy={e => e.stopPropagation()}
                onCut={e => e.stopPropagation()}
                onPaste={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                placeholder={cell.placeholder}
                onKeyDown={e => {
                    if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode))) e.stopPropagation();
                    if (e.keyCode === keyCodes.ESCAPE) this.wasEscKeyPressed = true;
                }}
            />
        )
    }
}

interface DIProps {
    onCellChanged: (...args: any[]) => void;
    cell: Record<string, any>;
}

const DropdownInput: FC<DIProps> = ({ onCellChanged, cell}) => {
    const divRef = React.useRef<any>(null)
    const [isOpen, setIsOpen] = React.useState(false)
    const [isOutside, setIsOutside] = React.useState(false);
    

    const handleItemClick = (value: string, event:React.MouseEvent<HTMLLIElement>) => {
        setIsOutside(false)
        setIsOpen(false)
        onCellChanged({ ...cell, text: value })
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    
    React.useEffect(() => {
        if (!isOpen || !isOutside) return
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }; 

    },[isOpen, isOutside]);
    
    return (
        <>
        <div
            ref={divRef}
            className='rg-dropdown-toggle'
            onClick={()=>setIsOpen(true)}
        />
        {isOpen&& (
        <ul className='rg-dropdown-menu'>
            {cell.values.map((option: OptionType) => (
                <li
                    key={option.value}
                    className='rg-dropdown-item'
                    onClick={(e) => handleItemClick(option.value, e)}
                    onMouseOut={()=>setIsOutside(true)}
                    onMouseOver={()=>setIsOutside(false)}
                >
                    {option.value}
                </li>
            ))}
        </ul>
        )}
        </>
    );
}