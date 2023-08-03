import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { getCellProperty } from '../Functions/getCellProperty';
import { keyCodes } from '../Functions/keyCodes';
import { Cell, CellStyle, CellTemplate, Compatible, Id, Uncertain, UncertainCompatible } from '../Model/PublicModel';
import { isNavigationKey, isAlphaNumericKey, isCharAlphaNumeric, isKeyPrintable } from './keyCodeCheckings';
import { getCharFromKey, getCharFromKeyCode } from './getCharFromKeyCode';

export interface ChevronCell extends Cell {
    type: 'chevron';
    text: string;
    isExpanded?: boolean;
    hasChildren?: boolean;
    parentId?: Id;
    indent?: number;
}

export class ChevronCellTemplate implements CellTemplate<ChevronCell> {
    private wasEscKeyPressed = false;

    getCompatibleCell(uncertainCell: Uncertain<ChevronCell>): Compatible<ChevronCell> {
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
        let hasChildren = false;
        try {
            hasChildren = getCellProperty(uncertainCell, 'hasChildren', 'boolean');
        } catch {
            hasChildren = false;
        }
        const value = parseFloat(text);
        return { ...uncertainCell, text, value, isExpanded, indent, hasChildren };
    }

    update(cell: Compatible<ChevronCell>, cellToMerge: UncertainCompatible<ChevronCell>): Compatible<ChevronCell> {
        return this.getCompatibleCell({ ...cell, isExpanded: cellToMerge.isExpanded, text: cellToMerge.text })
    }

    handleKeyDown(cell: Compatible<ChevronCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string): { cell: Compatible<ChevronCell>, enableEditMode: boolean } {
        let enableEditMode = keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER;
        const cellCopy = { ...cell };

        const char = getCharFromKey(key);

        if (keyCode === keyCodes.SPACE && cellCopy.isExpanded !== undefined && !shift) {
            cellCopy.isExpanded = !cellCopy.isExpanded;
        } else if (!ctrl && isKeyPrintable(key) && !(shift && keyCode === keyCodes.SPACE)) {
            cellCopy.text = char;
            enableEditMode = true;
        }
        return { cell: cellCopy, enableEditMode };
    }

    handleCompositionEnd(cell: Compatible<ChevronCell>, eventData: any): { cell: Compatible<ChevronCell>, enableEditMode: boolean } {
        return { cell: { ...cell, text: eventData }, enableEditMode: true }
    }

    getClassName(cell: Compatible<ChevronCell>, isInEditMode: boolean): string {
        const isExpanded = cell.hasChildren ? cell.isExpanded ? 'expanded' : 'collapsed' : '';
        const className = cell.className ?? '';
        return `${isExpanded} ${className}`;
    }

    getStyle(cell: Compatible<ChevronCell>, isInEditMode: boolean): CellStyle {
        const indent = cell.indent ?? 0;
        const elementMarginMultiplier = indent * 1.4;
        return { paddingLeft: `calc(${elementMarginMultiplier}em + 2px)` };
    }

    render(cell: Compatible<ChevronCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<ChevronCell>, commit: boolean) => void): React.ReactNode {
        return (
            !isInEditMode ?
                <>
                    {cell.hasChildren ?
                        <div
                            className='chevron'
                            onPointerDown={e => {
                                e.stopPropagation();
                                onCellChanged(this.getCompatibleCell({ ...cell, isExpanded: !cell.isExpanded }), true)
                            }}
                        >
                            <span className='icon'>❯</span>
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
                    onBlur={e => { onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), !this.wasEscKeyPressed); this.wasEscKeyPressed = false; }}
                    onCopy={e => e.stopPropagation()}
                    onCut={e => e.stopPropagation()}
                    onPaste={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                        if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode))) e.stopPropagation();
                        if (e.keyCode === keyCodes.ESCAPE) this.wasEscKeyPressed = true;
                    }}
                />
        );
    }

}

