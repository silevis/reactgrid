import React from "react";
import { StrictMode, useState } from "react";
import { Cell, NonEditableCell, NumberCell, ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";

export const AggregationExample = () => {
  const [yearsData, setYearsData] = useState([
    { label: "2023", values: [1, 3] },
    { label: "2024", values: [2, 4] },
  ]);

  // [{ label: "2023", values: [1, 3, 4] }, { label: "2024", values: [2, 4, 6] }]
  const yearsDataWithTotals = yearsData.map((year) => ({
    ...year,
    values: [...year.values, year.values.reduce((sum, value) => sum + value, 0)],
  }));

  // { label: "Sum", values: [3, 7, 10] }
  const summaryRow = {
    label: "Sum",
    values: yearsDataWithTotals.reduce(
      (sum, year) => sum.map((currentSum, index) => currentSum + year.values[index]),
      [0, 0, 0]
    ),
  };

  const cells: Cell[] = [
    // Header cells
    { rowIndex: 0, colIndex: 0, Template: NonEditableCell, props: { value: "" } },
    { rowIndex: 0, colIndex: 1, Template: NonEditableCell, props: { value: "H1" } },
    { rowIndex: 0, colIndex: 2, Template: NonEditableCell, props: { value: "H2" } },
    { rowIndex: 0, colIndex: 3, Template: NonEditableCell, props: { value: "Total" } },
    // Year data cells
    ...yearsDataWithTotals
      .map((year, rowIndex) => [
        { rowIndex: rowIndex + 1, colIndex: 0, Template: NonEditableCell, props: { value: year.label } },
        ...year.values.map((value, colIndex) => {
          const isEditable = colIndex + 1 !== year.values.length; // Last column is not editable
          return {
            rowIndex: rowIndex + 1,
            colIndex: colIndex + 1,
            Template: !isEditable ? NonEditableCell : NumberCell,
            props: {
              value,
              ...(isEditable && {
                onValueChanged: (newValue) => {
                  setYearsData((prev) => {
                    const updatedYears = [...prev];
                    updatedYears[rowIndex].values[colIndex] = newValue;
                    return updatedYears;
                  });
                },
              }),
            },
          };
        }),
      ])
      .flat(),
    // Summary row
    {
      rowIndex: yearsDataWithTotals.length + 1,
      colIndex: 0,
      Template: NonEditableCell,
      props: { value: summaryRow.label },
    },
    ...summaryRow.values.map((value, colIndex) => ({
      rowIndex: yearsDataWithTotals.length + 1,
      colIndex: colIndex + 1,
      Template: NonEditableCell,
      props: { value },
    })),
  ];

  return <ReactGrid cells={cells} styledRanges={styledRanges} />;
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
