import * as React from 'react';
import { keyCodes } from '../Functions/keyCodes';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible, Id, CellStyle } from '../Model';
import { isNavigationKey, isAlphaNumericKey } from './keyCodeCheckings';
import { getCellProperty } from '../Functions/getCellProperty';
import { getCharFromKeyCode } from './getCharFromKeyCode';
import { ReactComponent as Icon } from './../assets/chevron.svg';

export interface GroupCell extends Cell {
    type: 'group';
    text: string;
    isExpanded?: boolean;
    hasChildrens?: boolean;
    parentId?: Id;
    indent?: number;
}

export class GroupCellTemplate implements CellTemplate<GroupCell> {

    getCompatibleCell(uncertainCell: Uncertain<GroupCell>): Compatible<GroupCell> {
        const text = getCellProperty(uncertainCell, 'text', 'string');
        let isExpanded = false;
        try {
            isExpanded = getCellProperty(uncertainCell, 'isExpanded', 'boolean');
        } catch {
            isExpanded = true;
        }
        let indent = -1;
        try {
            indent = getCellProperty(uncertainCell, 'indent', 'number');
        } catch {
            indent = 0;
        }
        let hasChildrens = false;
        try {
            hasChildrens = getCellProperty(uncertainCell, 'hasChildrens', 'boolean');
        } catch {
            hasChildrens = false;
        }
        const value = parseFloat(text);
        return { ...uncertainCell, text, value, isExpanded, hasChildrens, indent };
    }

    update(cell: Compatible<GroupCell>, cellToMerge: UncertainCompatible<GroupCell>): Compatible<GroupCell> {
        return this.getCompatibleCell({ ...cell, isExpanded: cellToMerge.isExpanded, text: cellToMerge.text })
    }

    handleKeyDown(cell: Compatible<GroupCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<GroupCell>, enableEditMode: boolean } {
        let enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        const cellCopy = { ...cell };
        const char = getCharFromKeyCode(keyCode, shift);
        if (keyCode === keyCodes.SPACE && cellCopy.isExpanded !== undefined && !shift) {
            cellCopy.isExpanded = !cellCopy.isExpanded;
        } else if (!ctrl && !alt && isAlphaNumericKey(keyCode) && !(shift && keyCode === keyCodes.SPACE)) {
            cellCopy.text = !shift ? char.toLowerCase() : char;
            enableEditMode = true;
        }
        return { cell: cellCopy, enableEditMode };
    }

    getClassName(cell: Compatible<GroupCell>, isInEditMode: boolean) {
        const isExpanded = cell.hasChildrens ? cell.isExpanded ? 'expanded' : 'collapsed' : '';
        const className = cell.className ?? '';
        return `${isExpanded} ${className}`;
    }

    getStyle(cell: Compatible<GroupCell>, isInEditMode: boolean): CellStyle {
        const indent = cell.indent ?? 0;
        const elementMarginMultiplier = indent * 1.4;
        return { paddingLeft: `calc(${elementMarginMultiplier}em + 2px)` };
    }

    render(cell: Compatible<GroupCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<GroupCell>, commit: boolean) => void): React.ReactNode {
        return (
            !isInEditMode ?
                <>
                    {cell.hasChildrens ?
                        <div
                            className='chevron'
                            onPointerDown={e => {
                                e.stopPropagation();
                                onCellChanged(this.getCompatibleCell({ ...cell, isExpanded: !cell.isExpanded }), true)
                            }}
                        >
                            <Icon className='chevron-icon' />
                        </div>
                        :
                        <div className='no-child' />
                    }
                    {cell.text}
                </>
                :
                <input
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
        );
    }

}

