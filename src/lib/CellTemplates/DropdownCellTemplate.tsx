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
                //className='rg-dropdown-input'
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