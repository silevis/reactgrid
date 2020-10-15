import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { isAlphaNumericKey, isNavigationKey } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { getCharFromKeyCode } from './getCharFromKeyCode';

export interface EmailCell extends Cell {
    type: 'email',
    text: string,
    validator?: (text: string) => boolean,
    renderer?: (text: string) => React.ReactNode
}

export class EmailCellTemplate implements CellTemplate<EmailCell> {

    getCompatibleCell(uncertainCell: Uncertain<EmailCell>): Compatible<EmailCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        const value = parseFloat(text);
        return { ...uncertainCell, text, value };
    }

    handleKeyDown(cell: Compatible<EmailCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<EmailCell>, enableEditMode: boolean } {
        const char = getCharFromKeyCode(keyCode, shift);
        if (!ctrl && !alt && isAlphaNumericKey(keyCode) && !(shift && keyCode === keyCodes.SPACE))
            return { cell: { ...cell, text: !shift ? char.toLowerCase() : char }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: Compatible<EmailCell>, cellToMerge: UncertainCompatible<EmailCell>): Compatible<EmailCell> {
        return this.getCompatibleCell({ ...cell, text: cellToMerge.text })
    }

    getClassName(cell: Compatible<EmailCell>, isInEditMode: boolean) {
        const isValid = cell.validator ? cell.validator(cell.text) : true;
        return isValid ? 'valid' : 'invalid';
    }

    render(cell: Compatible<EmailCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<EmailCell>, commit: boolean) => void): React.ReactNode {
        if (!isInEditMode)
            return cell.renderer ? cell.renderer(cell.text) : cell.text;

        return <input
            ref={input => {
                if (input) input.focus();
            }}
            onChange={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), false)}
            onBlur={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), true)}
            onKeyDown={e => {
                if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode))) e.stopPropagation();
            }}
            defaultValue={cell.text}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}
