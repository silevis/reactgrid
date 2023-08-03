import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { isAlphaNumericKey, isKeyPrintable, isNavigationKey } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { getCharFromKey, getCharFromKeyCode } from './getCharFromKeyCode';

export interface EmailCell extends Cell {
    type: 'email',
    text: string,
    validator?: (text: string) => boolean,
    renderer?: (text: string) => React.ReactNode,
    errorMessage?: string
}

export class EmailCellTemplate implements CellTemplate<EmailCell> {
    private wasEscKeyPressed = false;

    getCompatibleCell(uncertainCell: Uncertain<EmailCell>): Compatible<EmailCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        const value = parseFloat(text);
        return { ...uncertainCell, text, value };
    }

    handleKeyDown(cell: Compatible<EmailCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string): { cell: Compatible<EmailCell>, enableEditMode: boolean } {
        const char = getCharFromKey(key);

        if (!ctrl && isKeyPrintable(key) && !(shift && keyCode === keyCodes.SPACE))
            return { cell: { ...cell, text: char }, enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    handleCompositionEnd(cell: Compatible<EmailCell>, eventData: any): { cell: Compatible<EmailCell>, enableEditMode: boolean } {
        return { cell: { ...cell, text: eventData }, enableEditMode: true }
    }

    update(cell: Compatible<EmailCell>, cellToMerge: UncertainCompatible<EmailCell>): Compatible<EmailCell> {
        return this.getCompatibleCell({ ...cell, text: cellToMerge.text })
    }

    getClassName(cell: Compatible<EmailCell>, isInEditMode: boolean): string {
        const isValid = cell.validator ? cell.validator(cell.text) : true;
        return isValid ? 'valid' : 'rg-invalid';
    }

    render(cell: Compatible<EmailCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<EmailCell>, commit: boolean) => void): React.ReactNode {
        if (!isInEditMode) {
            const isValid = cell.validator ? cell.validator(cell.text) : true;
            const textToDisplay = !isValid && cell.errorMessage ? cell.errorMessage : cell.text;
            return cell.renderer ? cell.renderer(textToDisplay) : textToDisplay;
        }

        return <input
            ref={input => {
                if (input) input.focus();
            }}
            onChange={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), false)}
            onBlur={e => { onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), !this.wasEscKeyPressed); this.wasEscKeyPressed = false; }}
            onKeyDown={e => {
                if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode))) e.stopPropagation();
                if (e.keyCode === keyCodes.ESCAPE) this.wasEscKeyPressed = true;
            }}
            defaultValue={cell.text}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}
