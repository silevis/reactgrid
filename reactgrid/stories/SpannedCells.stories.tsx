import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { TextCell } from "../lib/cellTemplates/TextCell";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { Cell, Column, Row } from "../lib/types/PublicModel";
import React from "react";
import { NonEditableCell, NumberCell } from "../lib/main";

const styledRanges = [
  {
    range: { start: { rowIndex: 2, columnIndex: 1 }, end: { rowIndex: 4, columnIndex: 3 } },
    styles: { background: "#e9efdf", color: "black" },
  },
];

interface Category {
  id: number;
  range: string;
  category: string;
  categoryPercentage: number;
  records: number;
}

const categoryArr: Category[] = [
  { id: 1, range: "1-5", category: "cat1", categoryPercentage: 50, records: 10 },
  { id: 2, range: "6-10", category: "cat2", categoryPercentage: 10, records: 20 },
  { id: 3, range: "11-15", category: "cat2", categoryPercentage: 10, records: 30 },
  { id: 4, range: "16-20", category: "cat3", categoryPercentage: 40, records: 40 },
  { id: 5, range: "21-25", category: "cat3", categoryPercentage: 40, records: 50 },
  { id: 6, range: "26-30", category: "cat3", categoryPercentage: 40, records: 60 },
];

const headers = ["Range", "Category", "Category %", "Records"];

export const SpannedCellsExample = () => {
  const [categories, setCategories] = useState<Category[]>(categoryArr);

  const updateCategories = (id: number, key: string, newValue) => {
    setCategories((prevData) =>
      prevData.map((category) => (category.id !== id ? category : { ...category, [key]: newValue }))
    );
  };

  const generateCells = (
    rows: Row[],
    columns: Column[],
    categories: Category[],
    updateCategories: (id: number, key: string, newValue) => void
  ): Cell[] => {
    const cells: Cell[] = [];

    rows.forEach((row, rowIndex) => {
      const categoryRowIndex = rowIndex;

      if (rowIndex === 0) {
        // Header Row
        columns.forEach((col, colIndex) => {
          cells.push({
            rowIndex,
            colIndex,
            Template: NonEditableCell,
            props: {
              value: headers[colIndex],
              style: {
                backgroundColor: "#55bc71",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              },
            },
          });
        });
      } else {
        const categoryCells = [
          {
            Template: TextCell,
            props: {
              text: categories[categoryRowIndex - 1].range,
              onTextChanged: (newRange: string) => {
                updateCategories(categories[categoryRowIndex - 1].id, "range", newRange);
              },
            },
          },
          {
            Template: TextCell,
            props: {
              text: categories[categoryRowIndex - 1].category,
              onTextChanged: (newCategory: string) => {
                updateCategories(categories[categoryRowIndex - 1].id, "category", newCategory);
              },
            },
          },
          {
            Template: NumberCell,
            props: {
              value: categories[categoryRowIndex - 1].categoryPercentage / 100,
              onValueChanged: (newCategoryPercentage: number) => {
                updateCategories(categories[categoryRowIndex - 1].id, "categoryPercentage", newCategoryPercentage);
              },
              format: new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 0 }),
            },
          },
          {
            Template: NumberCell,
            props: {
              value: categories[categoryRowIndex - 1].records,
              onValueChanged: (newRecords: string) => {
                updateCategories(categories[categoryRowIndex - 1].id, "records", newRecords);
              },
            },
          },
        ];

        columns.forEach((col, colIndex) => {
          const cell: Cell = {
            rowIndex,
            colIndex,
            ...categoryCells[colIndex],
          };

          if (colIndex === 1 || colIndex === 2) {
            if (rowIndex === 2) cell.rowSpan = 2;
            if (rowIndex === 4) cell.rowSpan = 3;
            if ([3, 5, 6].includes(rowIndex)) return; // Skip merged cells
          }

          cells.push(cell);
        });
      }
    });

    return cells;
  };

  const rows: Row[] = Array.from({ length: categories.length + 1 }, (_, i) => ({
    rowIndex: i,
    height: 40,
  }));

  const columns: Column[] = headers.map((_, index) => ({
    colIndex: index,
    width: 200,
  }));

  const cells = generateCells(rows, columns, categories, updateCategories);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <ReactGrid
        id="spanned-cells-example"
        enableColumnSelectionOnFirstRow
        styledRanges={styledRanges}
        columns={columns}
        rows={rows}
        stickyTopRows={1}
        initialFocusLocation={{ rowIndex: 1, colIndex: 0 }}
        cells={cells}
      />
    </div>
  );
};

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
