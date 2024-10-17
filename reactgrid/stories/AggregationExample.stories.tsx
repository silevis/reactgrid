import React from "react";
import { StrictMode, useState } from "react";
import { Cell, NonEditableCell, NumberCell, ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";

interface YearData {
  label: string;
  values: number[];
}

const createMonthHeaderCell = (rowIndex: number, colIndex: number, label: string, style?: React.CSSProperties) => ({
  rowIndex,
  colIndex,
  Template: NonEditableCell,
  props: {
    value: label,
    style,
  },
  isSelectable: false,
});

const createYearDataRow = (rowIndex: number, year: YearData, setYearsData) => {
  const yearTitleCell = {
    rowIndex,
    colIndex: 0,
    Template: NonEditableCell,
    props: {
      value: year.label,
    },
  };

  const isTotalCell = (colIndex: number) => colIndex === year.values.length - 1; // last column is the total

  const yearValueCells = year.values.map((value, colIndex) => {
    const isEditable = year.label !== "Sum" && !isTotalCell(colIndex);
    return {
      rowIndex,
      colIndex: colIndex + 1, // skip the first column for the year label
      Template: isEditable ? NumberCell : NonEditableCell,
      props: {
        value,
        ...(isEditable && {
          onValueChanged: (newValue) => {
            setYearsData((prev: YearData[]) => {
              const newYearsData = [...prev];
              const yearIndex = rowIndex - 1; // adjust for header row
              newYearsData[yearIndex].values[colIndex] = newValue;
              return newYearsData;
            });
          },
        }),
      },
    };
  });

  return [yearTitleCell, ...yearValueCells];
};

const generateGridCells = (yearDataList: YearData[], setYearsData) => {
  const headerRowCells = [
    createMonthHeaderCell(0, 0, ""),
    createMonthHeaderCell(0, 1, "H1"),
    createMonthHeaderCell(0, 2, "H2"),
    createMonthHeaderCell(0, 3, "Total"),
  ];

  const yearCells = yearDataList.reduce((acc: Cell[], yearData, yearIndex) => {
    const rowIndex = yearIndex + 1; // skip the first row for the header
    return acc.concat(createYearDataRow(rowIndex, yearData, setYearsData));
  }, []);

  return [...headerRowCells, ...yearCells];
};

const addSummaryRow = (years: YearData[]) => {
  const summedValues = years.reduce(
    (sum, year) => sum.map((currentSum, index) => currentSum + year.values[index]),
    [0, 0, 0]
  );

  return {
    label: "Sum",
    values: summedValues, // e.g. [3, 7, 10]
  };
};

const addTotalValues = (years: YearData[]) => {
  return years.map((year) => {
    const total = year.values.reduce((sum, value) => sum + value, 0);
    return {
      ...year,
      values: [...year.values, total], // e.g. [1, 3, 4]
    };
  });
};

const initialYearData: YearData[] = [
  {
    label: "2023",
    values: new Array(2).fill(0).map(() => Math.floor(Math.random() * 9) + 1), // e.g. [1, 3]
  },
  {
    label: "2024",
    values: new Array(2).fill(0).map(() => Math.floor(Math.random() * 9) + 1), // e.g. [2, 4]
  },
];

export const AggregationExample = () => {
  const [yearsData, setYearsData] = useState(initialYearData);

  const yearsDataWithTotal = addTotalValues(yearsData);
  const yearsDataWithSummary = [...yearsDataWithTotal, addSummaryRow(yearsDataWithTotal)];

  const gridCells = generateGridCells(yearsDataWithSummary, setYearsData);

  return <ReactGrid cells={gridCells} styledRanges={styledRanges} />;
};

const styledRanges = [
  {
    range: { start: { rowIndex: 0, columnIndex: 1 }, end: { rowIndex: 1, columnIndex: 4 } },
    styles: { background: "#55bc71", color: "white" },
  },
  {
    range: { start: { rowIndex: 1, columnIndex: 0 }, end: { rowIndex: 4, columnIndex: 1 } },
    styles: { background: "#55bc71", color: "white" },
  },
  {
    range: { start: { rowIndex: 0, columnIndex: 0 }, end: { rowIndex: 1, columnIndex: 1 } },
    styles: { background: "#318146", color: "white" },
  },
  {
    range: { start: { rowIndex: 3, columnIndex: 1 }, end: { rowIndex: 4, columnIndex: 4 } },
    styles: { background: "#f8f8f8" },
  },
  {
    range: { start: { rowIndex: 1, columnIndex: 3 }, end: { rowIndex: 3, columnIndex: 4 } },
    styles: { background: "#f8f8f8" },
  },
];

export default {
  decorators: [
    (Component) => (
      <StrictMode>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </StrictMode>
    ),
  ],
} satisfies StoryDefault;
