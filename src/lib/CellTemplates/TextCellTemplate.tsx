import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { isAlphaNumericKey, isNavigationKey } from './keyCodeCheckings'
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { getCharFromKeyCode } from './getCharFromKeyCode';

export interface TextCell extends Cell {
    type: 'text',
    text: string,
    validator?: (text: string) => boolean,
    renderer?: (text: string) => React.ReactNode
}

export class TextCellTemplate implements CellTemplate<TextCell> {

    getCompatibleCell(uncertainCell: Uncertain<TextCell>): Compatible<TextCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        const value = parseFloat(text); // TODO more advanced parsing for all text based cells
        return { ...uncertainCell, text, value };
    }

    update(cell: Compatible<TextCell>, cellToMerge: UncertainCompatible<TextCell>): Compatible<TextCell> {
        return this.getCompatibleCell({ ...cell, text: cellToMerge.text })
    }

    handleKeyDown(cell: Compatible<TextCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<TextCell>, enableEditMode: boolean } {
        const char = getCharFromKeyCode(keyCode, shift);
        if (!ctrl && !alt && isAlphaNumericKey(keyCode) && !(shift && keyCode === keyCodes.SPACE))
            return { cell: this.getCompatibleCell({ ...cell, text: shift ? char : char.toLowerCase() }), enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    getClassName(cell: Compatible<TextCell>, isInEditMode: boolean) {
        const isValid = cell.validator ? cell.validator(cell.text) : true;
        const className = cell.className ? cell.className : '';
        return `${isValid ? 'valid' : 'invalid'} ${className}`;
    }

    render(cell: Compatible<TextCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TextCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode)
            return cell.renderer ? cell.renderer(cell.text) : cell.text;

        return <input
            ref={input => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={cell.text}
            onChange={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), false)}
            onBlur={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), true)}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => {
                if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode))) e.stopPropagation();
            }}
        />
    }
}