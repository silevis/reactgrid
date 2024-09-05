import { Column } from "@silevis/reactgrid";

export type BPColumn = Column;

const getMonth = (year: number, quarter: string, month: number) => {
    const formattedMonth = `${month}`.padStart(2, '0');
    return { columnId: `${year}-${quarter}-${formattedMonth}`, width: 100 };
}

const getQuarter = (year: number, quarter: string) => {
    return { columnId: `${year}-${quarter}`, width: 100 };
}

const generateQuarter = (year: number, quarter: string, month: number) => {
    return [
        getQuarter(year, quarter),
        getMonth(year, quarter, month),
        getMonth(year, quarter, month + 1),
        getMonth(year, quarter, month + 2),
    ]
}

const generateYear = (year: number) => {
    return [
        { columnId: `${year}`, width: 100 },
        ...generateQuarter(year, 'Q1', 1),
        ...generateQuarter(year, 'Q2', 4),
        ...generateQuarter(year, 'Q3', 7),
        ...generateQuarter(year, 'Q4', 10),
    ]
}

export const dataColumns: BPColumn[] = [
    { columnId: 'Struct', width: 250 },
    ...generateYear(2020),
    ...generateYear(2021),
]