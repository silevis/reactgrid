import { Cell, NonEditableCell, NumberCell } from "@silevis/reactgrid";
import { ChevronCell } from "./ChevronCell";

// Helper function to format numbers
const myNumberFormat = new Intl.NumberFormat("us", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const generateMonthHeader = (year: number, quarter: string, month: number, colIndex: number): Cell => {
  const formattedMonth = `${month}`.padStart(2, "0");
  return {
    rowIndex: 0,
    colIndex,
    props: { value: `${formattedMonth}`, parentId: `${year}-${quarter}` },
    Template: NonEditableCell,
  };
};

const generateQuarterHeader = (
  year: number,
  quarter: string,
  colIndex: number,
  hasChildren: boolean = true,
  isExpanded: boolean = true
): Cell => {
  return {
    rowIndex: 0,
    colIndex,
    Template: NonEditableCell,
    props: {
      value: quarter,
      parentId: `${year}`,
      hasChildren,
      isExpanded,
    },
  };
};

const generateQuarter = (
  year: number,
  quarter: string,
  startMonth: number,
  startColIndex: number,
  isExpanded: boolean = true
): Cell[] => {
  return [
    generateQuarterHeader(year, quarter, startColIndex, isExpanded),
    generateMonthHeader(year, quarter, startMonth, startColIndex + 1),
    generateMonthHeader(year, quarter, startMonth + 1, startColIndex + 2),
    generateMonthHeader(year, quarter, startMonth + 2, startColIndex + 3),
  ];
};

function generateYear(
  year: number,
  startColIndex: number,
  hasChildren: boolean = true,
  isExpanded: boolean = true
): Cell[] {
  return [
    {
      rowIndex: 0,
      colIndex: startColIndex,
      props: { value: `${year}`, parentId: undefined, hasChildren, isExpanded },
      Template: NonEditableCell,
    },
    ...generateQuarter(year, "Q1", 1, startColIndex + 1),
    ...generateQuarter(year, "Q2", 4, startColIndex + 5),
    ...generateQuarter(year, "Q3", 7, startColIndex + 9),
    ...generateQuarter(year, "Q4", 10, startColIndex + 13),
  ];
}

const generateNumberCell = (
  rowIndex: number,
  colIndex: number,
  value: number,
  className: string = "",
  nanToZero: boolean = true
): Cell => {
  return {
    rowIndex,
    colIndex,
    Template: NumberCell,
    props: { value, className, nanToZero, format: myNumberFormat },
  };
};

const generateNonEditableNumberCell = (
  rowIndex: number,
  colIndex: number,
  value: number,
  className: string = "",
  nanToZero: boolean = true
): Cell => {
  return {
    rowIndex,
    colIndex,
    Template: NonEditableCell,
    props: { value, className, nanToZero, format: myNumberFormat },
  };
};

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const filledYear = (
  rowIndex: number,
  startColIndex: number,
  min: number = 0,
  max: number = 10000,
  bonus: number = 0
): Cell[] => {
  return [
    generateNonEditableNumberCell(rowIndex, startColIndex, 0, "year"),
    generateNumberCell(rowIndex, startColIndex + 1, 0, "quarter editable"),
    generateNumberCell(rowIndex, startColIndex + 2, getRandomInt(min, max), "month editable"),
    generateNumberCell(rowIndex, startColIndex + 3, getRandomInt(min, max), "month editable"),
    generateNumberCell(rowIndex, startColIndex + 4, getRandomInt(min, max), "month editable"),
    generateNumberCell(rowIndex, startColIndex + 5, 0, "quarter editable"),
    generateNumberCell(rowIndex, startColIndex + 6, getRandomInt(min, max) + bonus * 1, "month editable"),
    generateNumberCell(rowIndex, startColIndex + 7, getRandomInt(min, max) + bonus * 1, "month editable"),
    generateNumberCell(rowIndex, startColIndex + 8, getRandomInt(min, max) + bonus * 1, "month editable"),
    generateNumberCell(rowIndex, startColIndex + 9, 0, "quarter editable"),
    generateNumberCell(rowIndex, startColIndex + 10, getRandomInt(min, max) + bonus * 2, "month editable"),
    generateNumberCell(rowIndex, startColIndex + 11, getRandomInt(min, max) + bonus * 2, "month editable"),
    generateNumberCell(rowIndex, startColIndex + 12, getRandomInt(min, max) + bonus * 2, "month editable"),
    generateNumberCell(rowIndex, startColIndex + 13, 0, "quarter editable"),
    generateNumberCell(rowIndex, startColIndex + 14, getRandomInt(min, max) + bonus * 3, "month editable"),
    generateNumberCell(rowIndex, startColIndex + 15, getRandomInt(min, max) + bonus * 3, "month editable"),
    generateNumberCell(rowIndex, startColIndex + 16, getRandomInt(min, max) + bonus * 3, "month editable"),
  ];
};

export const cellsData: Cell[] = [
  {
    rowIndex: 0,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Organization / Period" },
  },
  ...generateYear(2020, 1),
  ...generateYear(2021, 17),
  {
    rowIndex: 1,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Silevis organization" },
  },
  ...filledYear(1, 1),
  ...filledYear(1, 17),
  {
    rowIndex: 2,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Expenses" },
  },
  ...filledYear(2, 1),
  ...filledYear(2, 17),
  {
    rowIndex: 3,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Fixed" },
  },
  ...filledYear(3, 1),
  ...filledYear(3, 17),
  {
    rowIndex: 4,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Salaries" },
  },
  ...filledYear(4, 1),
  ...filledYear(4, 17),
  {
    rowIndex: 5,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Serge Gainsbourg" },
  },
  ...filledYear(5, 1, 5500, 5500, 300.32),
  ...filledYear(5, 17, 6400, 6400, 300),
  {
    rowIndex: 6,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Jacob Sandberg" },
  },
  ...filledYear(6, 1, 4500, 4500, 100),
  ...filledYear(6, 17, 6000, 6000, 50.12),
  {
    rowIndex: 7,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Elizabeth Hudson" },
  },
  ...filledYear(7, 1, 5500, 5500, 300),
  ...filledYear(7, 17, 6400, 6400, 300),
  {
    rowIndex: 8,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Office costs" },
  },
  ...filledYear(8, 1),
  ...filledYear(8, 17),
  {
    rowIndex: 9,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Gas" },
  },
  ...filledYear(9, 1, 1000, 1200, 10.1),
  ...filledYear(9, 17, 1050, 1100, 12.02),
  {
    rowIndex: 10,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Electricity" },
  },
  ...filledYear(10, 1, 90, 110, 1.2),
  ...filledYear(10, 17, 80, 120, 1.02),
  {
    rowIndex: 11,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Rent" },
  },
  ...filledYear(11, 1, 2200, 2200),
  ...filledYear(11, 17, 2300, 2300),
  {
    rowIndex: 12,
    colIndex: 0,
    Template: ChevronCell,
    props: { value: "Insurance" },
  },
  ...filledYear(12, 1, 1520, 1520),
  ...filledYear(12, 17, 1530, 1540),
  {
    rowIndex: 13,
    colIndex: 0,
    Template: NumberCell,
    props: { value: "One-time" },
  },
  ...filledYear(13, 1),
  ...filledYear(13, 17),
  {
    rowIndex: 14,
    colIndex: 0,
    Template: NonEditableCell,
    props: { value: "Vehicle" },
  },
  ...filledYear(14, 1, 35000, 35000, 10.1),
  ...filledYear(14, 17, 3000, 3000, 10.1),
  {
    rowIndex: 15,
    colIndex: 0,
    Template: NonEditableCell,
    props: { value: "Computer" },
  },
  ...filledYear(15, 1, 3000, 3000, 10.1),
  ...filledYear(15, 17, 3200, 3200, 10.1),
];
