import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { inNumericKey, isNavigationKey, isNumpadNumericKey, isAllowedOnNumberTypingKey } from './keyCodeCheckings';

export interface NumberCell extends Cell {
    type: 'number';
    value: number;
    format?: Intl.NumberFormat;
    nanToZero?: boolean;
    hideZero?: boolean;
}

export class NumberCellTemplate implements CellTemplate<NumberCell> {

    getCompatibleCell(uncertainCell: Uncertain<NumberCell>): Compatible<NumberCell> {
        let value: number;
        try {
            value = getCellProperty(uncertainCell, 'value', 'number');
        } catch (error) {
            value = NaN;
        }
        const numberFormat = uncertainCell.format || new Intl.NumberFormat(window.navigator.language);
        const displayValue = (uncertainCell.nanToZero && Number.isNaN(value)) ? 0 : value;
        const text = (Number.isNaN(displayValue) || (uncertainCell.hideZero && displayValue === 0)) ? '' : numberFormat.format(displayValue);
        return { ...uncertainCell, value: displayValue, text }
    }

    handleKeyDown(cell: Compatible<NumberCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<NumberCell>; enableEditMode: boolean } {
        if (isNumpadNumericKey(keyCode)) keyCode -= 48;
        const char = String.fromCharCode(keyCode);
        if (!ctrl && !alt && !shift && (inNumericKey(keyCode) || isAllowedOnNumberTypingKey(keyCode))) {
            const value = Number(char);
            if (Number.isNaN(value) && isAllowedOnNumberTypingKey(keyCode))
                return { cell: { ...this.getCompatibleCell({ ...cell, value }), text: char }, enableEditMode: true }
            return { cell: this.getCompatibleCell({ ...cell, value }), enableEditMode: true }
        }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: Compatible<NumberCell>, cellToMerge: UncertainCompatible<NumberCell>): Compatible<NumberCell> {
        return this.getCompatibleCell({ ...cell, value: cellToMerge.value });
    }

    private getTextFromCharCode = (cellText: string): string => {
        switch (cellText.charCodeAt(0)) {
            case keyCodes.DASH:
            case keyCodes.FIREFOX_DASH:
            case keyCodes.SUBTRACT:
                return '-';
            case keyCodes.COMMA:
                return ','
            case keyCodes.PERIOD:
            case keyCodes.DECIMAL:
                return '.';
            default:
                return cellText;
        }
    }

    getClassName(cell: Compatible<NumberCell>, isInEditMode: boolean): string {
        return cell.className ? cell.className : '';
    }

    render(cell: Compatible<NumberCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<NumberCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode) {
            return cell.text;
        }

        const locale = cell.format ? cell.format.resolvedOptions().locale : window.navigator.languages[0];
        const format = new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 });

        return <input
            ref={input => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }
            }}
            defaultValue={Number.isNaN(cell.value) ? this.getTextFromCharCode(cell.text) : format.format(cell.value)}
            onChange={e => onCellChanged(this.getCompatibleCell({ ...cell, value: parseFloat(e.currentTarget.value.replace(/,/g, '.')) }), false)}
            onBlur={e => onCellChanged(this.getCompatibleCell({ ...cell, value: parseFloat(e.currentTarget.value.replace(/,/g, '.')) }), true)}
            onKeyDown={e => {
                if (inNumericKey(e.keyCode) || isNavigationKey(e.keyCode) || isAllowedOnNumberTypingKey(e.keyCode)) e.stopPropagation();
                if ((!inNumericKey(e.keyCode) && !isNavigationKey(e.keyCode) && !isAllowedOnNumberTypingKey(e.keyCode)) || e.shiftKey) e.preventDefault();
            }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}
