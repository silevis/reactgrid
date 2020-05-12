import * as React from 'react';
import { CellTemplate, Cell, Compatible, Uncertain, UncertainCompatible, Id, CellStyle } from '../Model';
export interface GroupCell extends Cell {
    type: 'group';
    text: string;
    isExpanded?: boolean;
    hasChildrens?: boolean;
    parentId?: Id;
    indent?: number;
}
export declare class GroupCellTemplate implements CellTemplate<GroupCell> {
    getCompatibleCell(uncertainCell: Uncertain<GroupCell>): Compatible<GroupCell>;
    update(cell: Compatible<GroupCell>, cellToMerge: UncertainCompatible<GroupCell>): Compatible<GroupCell>;
    handleKeyDown(cell: Compatible<GroupCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<GroupCell>;
        enableEditMode: boolean;
    };
    getClassName(cell: Compatible<GroupCell>, isInEditMode: boolean): string;
    getStyle(cell: Compatible<GroupCell>, isInEditMode: boolean): CellStyle;
    render(cell: Compatible<GroupCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<GroupCell>, commit: boolean) => void): React.ReactNode;
}
