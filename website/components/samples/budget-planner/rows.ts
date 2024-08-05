import { Row, NumberCell } from "@silevis/reactgrid";
import { RowCells } from '../budget-planner';
import { HorizontalChevronCell } from '../cell-templates/horizontal-chevron-cell-template/horizontal-chevron-cell-template';
import { NonEditableNumberCell } from './cell-templates';

const generateMonthHeader = (year: number, quarter: string, month: number): HorizontalChevronCell => {
    const formattedMonth = `${month}`.padStart(2, '0');
    return { type: 'horizontalChevron', text: `${formattedMonth}`, className: 'month header', parentId: `${year}-${quarter}` };
}

const generateQuarterHeader = (year: number, quarter: string, hasChildren: boolean = true, isExpanded: boolean = true): HorizontalChevronCell => {
    return { type: 'horizontalChevron', text: quarter, className: 'quarter header', parentId: `${year}`, hasChildren, isExpanded: true };
}

const generateQuarter = (year: number, quarter: string, month: number, isExpanded: boolean = true) => {
    return [
        generateQuarterHeader(year, quarter, isExpanded),
        generateMonthHeader(year, quarter, month),
        generateMonthHeader(year, quarter, month + 1),
        generateMonthHeader(year, quarter, month + 2),
    ]
}

const generateYear = (year: number, hasChildren: boolean = true, isExpanded: boolean = true): RowCells[] => {
    return [
        { type: 'horizontalChevron', text: `${year}`, className: 'year header', parentId: undefined, hasChildren, isExpanded },
        ...generateQuarter(year, 'Q1', 1),
        ...generateQuarter(year, 'Q2', 4),
        ...generateQuarter(year, 'Q3', 7),
        ...generateQuarter(year, 'Q4', 10),
    ];
}

export const topHeaderRow: Row<RowCells> = {
    rowId: 'topHeader',
    cells: [
        { type: 'text', text: 'Organization / Period' },
        ...generateYear(2020),
        ...generateYear(2021),
    ]
};

const myNumberFormat = new Intl.NumberFormat('us', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });

const generateNumberCell = (value: number, className: string = '', nanToZero: boolean = true): NumberCell => {
    return { type: 'number', value, className, nanToZero, format: myNumberFormat };
}

const generateNonEditableNumberCell = (value: number, className: string = '', nanToZero: boolean = true): NonEditableNumberCell => {
    return { type: 'nonEditableNumber', value, className, nanToZero, format: myNumberFormat };
}

export const emptyYear = (): RowCells[] => [
    generateNonEditableNumberCell(0, 'year'),
    generateNonEditableNumberCell(0, 'quarter'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'quarter'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'quarter'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'quarter'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'month'),
    generateNonEditableNumberCell(0, 'month'),
];

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export const filledYear = (min: number = 0, max: number = 10000, bonus: number = 0): RowCells[] => {
    return [
        generateNonEditableNumberCell(0, 'year'),
        generateNumberCell(0, 'quarter editable'),
        generateNumberCell(getRandomInt(min, max), 'month editable'),
        generateNumberCell(getRandomInt(min, max), 'month editable'),
        generateNumberCell(getRandomInt(min, max), 'month editable'),
        generateNumberCell(0, 'quarter editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 1, 'month editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 1, 'month editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 1, 'month editable'),
        generateNumberCell(0, 'quarter editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 2, 'month editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 2, 'month editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 2, 'month editable'),
        generateNumberCell(0, 'quarter editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 3, 'month editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 3, 'month editable'),
        generateNumberCell(getRandomInt(min, max) + bonus * 3, 'month editable'),
    ]
};

export const dataRows: Row<RowCells>[] = [
    {
        rowId: 'Silevis',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Silevis organization', parentId: undefined, isExpanded: true },
            ...emptyYear(),
            ...emptyYear(),
        ]
    },
    {
        rowId: 'Expenses',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Expenses', parentId: 'Silevis', isExpanded: true },
            ...emptyYear(),
            ...emptyYear(),
        ]
    },
    {
        rowId: 'Fixed',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Fixed', parentId: 'Expenses', isExpanded: true },
            ...emptyYear(),
            ...emptyYear(),
        ]
    },
    {
        rowId: 'Salaries',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Salaries', parentId: 'Fixed', isExpanded: true },
            ...emptyYear(),
            ...emptyYear(),
        ]
    },
    {
        rowId: 'Serge Gainsbourg',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Serge Gainsbourg', parentId: 'Salaries', isExpanded: true },
            ...filledYear(5500, 5500, 300.32),
            ...filledYear(6400, 6400, 300),
        ]
    },
    {
        rowId: 'Jacob Sandberg',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Jacob Sandberg', parentId: 'Salaries' },
            ...filledYear(4500, 4500, 100),
            ...filledYear(6000, 6000, 50.12),
        ]
    },
    {
        rowId: 'Elizabeth Hudson',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Elizabeth Hudson', parentId: 'Salaries' },
            ...filledYear(5500, 5500, 300),
            ...filledYear(6400, 6400, 300),
        ]
    },
    {
        rowId: 'Office costs',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Office costs', parentId: 'Fixed', isExpanded: true },
            ...emptyYear(),
            ...emptyYear(),
        ]
    },
    {
        rowId: 'Gas',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Gas', parentId: 'Office costs' },
            ...filledYear(1000, 1200, 10.1),
            ...filledYear(1050, 1100, 12.02),
        ]
    },
    {
        rowId: 'Electricity',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Electricity', parentId: 'Office costs' },
            ...filledYear(90, 110, 1.2),
            ...filledYear(80, 120, 1.02),
        ]
    },
    {
        rowId: 'Rent',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Rent', parentId: 'Office costs' },
            ...filledYear(2200, 2200),
            ...filledYear(2300, 2300),
        ]
    },
    {
        rowId: 'Insurance',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Insurance', parentId: 'Fixed', isExpanded: true },
            ...filledYear(1520, 1520),
            ...filledYear(1530, 1540),
        ]
    },
    {
        rowId: 'One-time',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'One-time', parentId: 'Expenses', isExpanded: true },
            ...emptyYear(),
            ...emptyYear(),
        ]
    },
    {
        rowId: 'Vehicle',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Vehicle', parentId: 'One-time' },
            generateNonEditableNumberCell(0, 'year'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(35000, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(25000, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNonEditableNumberCell(0, 'year'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(25000, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
        ]
    },
    {
        rowId: 'Computer',
        reorderable: true,
        cells: [
            { type: 'chevron', text: 'Computer', parentId: 'One-time' },
            generateNonEditableNumberCell(0, 'year'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(3000, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(3200, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNonEditableNumberCell(0, 'year'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(3000, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'quarter editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
            generateNumberCell(0, 'month editable'),
        ]
    },
];