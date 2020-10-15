import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { keyCodes } from '../Functions/keyCodes';
import { inNumericKey, isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings';
import { getTimestamp, getFormattedTimeUnit } from './timeUtils';

export interface DateCell extends Cell {
    type: 'date';
    date?: Date;
    format?: Intl.DateTimeFormat;
}

export class DateCellTemplate implements CellTemplate<DateCell> {

    getCompatibleCell(uncertainCell: Uncertain<DateCell>): Compatible<DateCell> {
        const date = uncertainCell.date ? getCellProperty(uncertainCell, 'date', 'object') : new Date(NaN);
        const dateFormat = uncertainCell.format || new Intl.DateTimeFormat(window.navigator.language);
        const value = date.getTime();
        const text = !Number.isNaN(value) ? dateFormat.format(date) : '';
        return { ...uncertainCell, date, value, text }
    }

    handleKeyDown(cell: Compatible<DateCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<DateCell>, enableEditMode: boolean } {
        if (!ctrl && !alt && !shift && isAlphaNumericKey(keyCode))
            return { cell: this.getCompatibleCell({ ...cell }), enableEditMode: true }
        return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
    }

    update(cell: Compatible<DateCell>, cellToMerge: UncertainCompatible<DateCell>): Compatible<DateCell> {
        return this.getCompatibleCell({ ...cell, date: new Date(cellToMerge.value) });
    }

    getClassName(cell: Compatible<DateCell>, isInEditMode: boolean) {
        return cell.className ? cell.className : '';
    }

    render(cell: Compatible<DateCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DateCell>, commit: boolean) => void): React.ReactNode {

        if (!isInEditMode)
            return cell.text;

        const year = getFormattedTimeUnit(cell.date!.getFullYear());
        const month = getFormattedTimeUnit(cell.date!.getMonth() + 1);
        const day = getFormattedTimeUnit(cell.date!.getDate());

        return <input
            ref={input => {
                if (input) input.focus();
            }}
            type='date'
            defaultValue={`${year}-${month}-${day}`}
            onChange={e => {
                const timestamp = getTimestamp(e.currentTarget.value, '');
                if (!Number.isNaN(timestamp)) {
                    onCellChanged(this.getCompatibleCell({ ...cell, date: new Date(timestamp) }), false);
                }
            }}
            onBlur={e => {
                const timestamp = getTimestamp(e.currentTarget.value, '');
                if (!Number.isNaN(timestamp)) {
                    onCellChanged(this.getCompatibleCell({ ...cell, date: new Date(timestamp) }), true);
                }
            }}
            onKeyDown={e => {
                if (inNumericKey(e.keyCode) || isNavigationKey(e.keyCode) || (e.keyCode === keyCodes.COMMA || e.keyCode === keyCodes.PERIOD)) e.stopPropagation();
                if (!inNumericKey(e.keyCode) && !isNavigationKey(e.keyCode) && (e.keyCode !== keyCodes.COMMA && e.keyCode !== keyCodes.PERIOD)) e.preventDefault();
            }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
        />
    }
}