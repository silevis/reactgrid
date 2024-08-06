import { Column, DefaultCellTypes, TextCell, HeaderCell, CellChange, Row, NumberCell, DateCell, CellStyle } from "@silevis/reactgrid/lib";
import { useRef, useEffect } from "react";
import { DropdownCell, getDropdownCell } from "../../cellTemplates/dropdownCellTemplate/dropdownCellTemplate";
import { WorkLog, projects } from "../../data/workhoursData/initialValues";
import { getButtonCell } from "../../cellTemplates/buttonCellTemplate/buttonCellTemplate";


export interface ExtendedColumn extends Column {
    key?: string;
}

export type CustomTypes = DefaultCellTypes | DropdownCell

export const initialColumns: ExtendedColumn[] = [
    { columnId: 0, resizable: true, width: 50 },
    { columnId: 1, resizable: true, width: 150, key: 'date' },
    { columnId: 2, resizable: true, width: 200, key: 'employee' },
    { columnId: 3, resizable: true, width: 100, key: 'hours' },
    { columnId: 4, resizable: true, width: 300, key: 'project' },
    { columnId: 5, width: 350, resizable: true, key: 'description' },
]

export const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

const transparentBorder: CellStyle = { color: 'rgba(0,0,0,0.25)' }
const transparentBorderStyle: CellStyle = { border: { top: transparentBorder, right: transparentBorder, bottom: transparentBorder } }

export const getTextCell = (text?: string): TextCell => ({ type: 'text', text: text || '' })
export const getHeaderCell = (text?: string, background?: string): HeaderCell => ({ type: 'header', text: text || '', style: { background, ...transparentBorderStyle } })

export const getCellValue = (change: CellChange<CustomTypes>) => {
    const { newCell } = change;
    switch (newCell.type) {
        case 'number':
            return newCell.value
        case 'dropdown':
        case 'text':
            return newCell.text
        case 'date':
            return newCell.date
        default:
            return ''
    }
}

export const transformLogsToModel = (logs: WorkLog[], height: number): Row<CustomTypes>[] => {
    return logs.map((log, idx) => ({
        rowId: log.id,
        height,
        cells: [
            { type: 'number', value: idx + 1, className: 'idx-cell' } as NumberCell,
            { type: 'date', date: log.date, className: 'date-cell' } as DateCell,
            getTextCell(log.employee),
            { type: 'number', value: log.hours } as NumberCell,
            getDropdownCell(log.project || '', projects, false, {}, 'dropdown-cell'),
            getTextCell(log.description),
        ]
    }))
}

export const getBlankRow = (onPressButton: () => void, height: number, id: number) => ({
    rowId: id,
    height,
    cells: [
        getButtonCell('+', onPressButton, {}, 'add-row-button'),
        { type: 'date', date: undefined, className: 'date-cell' } as DateCell,
        getTextCell(''),
        { type: 'number', value: 0, nanToZero: true, hideZero: true } as NumberCell,
        getDropdownCell('', projects, false, {}, 'dropdown-cell'),
        getTextCell(''),
    ]
})