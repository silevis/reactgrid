import { NumberCell, Compatible, NumberCellTemplate, Cell } from "@silevis/reactgrid";


export interface NonEditableNumberCell extends Cell {
    type: 'nonEditableNumber';
    value: number;
    format?: Intl.NumberFormat;
    nanToZero?: boolean;
    hideZero?: boolean;
}

export const nonEditableNumberCellTemplate = new NumberCellTemplate();

nonEditableNumberCellTemplate.handleKeyDown = (cell: Compatible<NumberCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): any => {
    return { cell, enableEditMode: false };
};