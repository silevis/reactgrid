import * as React from "react";
import { Cell, CellStyle, CellTemplate, Compatible, Id, Uncertain, UncertainCompatible } from "../Model/PublicModel";
export interface ChevronCell extends Cell {
    type: "chevron";
    text: string;
    isExpanded?: boolean;
    hasChildren?: boolean;
    parentId?: Id;
    indent?: number;
}
export declare class ChevronCellTemplate implements CellTemplate<ChevronCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<ChevronCell>): Compatible<ChevronCell>;
    update(cell: Compatible<ChevronCell>, cellToMerge: UncertainCompatible<ChevronCell>): Compatible<ChevronCell>;
    handleKeyDown(cell: Compatible<ChevronCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<ChevronCell>;
        enableEditMode: boolean;
    };
    handleCompositionEnd(cell: Compatible<ChevronCell>, eventData: any): {
        cell: Compatible<ChevronCell>;
        enableEditMode: boolean;
    };
    getClassName(cell: Compatible<ChevronCell>, isInEditMode: boolean): string;
    getStyle(cell: Compatible<ChevronCell>, isInEditMode: boolean): CellStyle;
    render(cell: Compatible<ChevronCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<ChevronCell>, commit: boolean) => void): React.ReactNode;
}
