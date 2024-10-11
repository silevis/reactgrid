import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { TextCell } from "../lib/cellTemplates/TextCell";
import { ReactGrid } from "../lib/components/ReactGrid";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { Cell, Column, Row } from "../lib/types/PublicModel";
import React from "react";
import { NonEditableCell, NumberCell } from "../lib/main";

const cellsStyles = {
  header: {
    backgroundColor: "#55bc71",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
};

const styledRanges = [
  {
    range: { start: { rowIndex: 2, columnIndex: 1 }, end: { rowIndex: 4, columnIndex: 3 } },
    styles: { background: "#e9efdf", color: "black" },
  },
];

interface Category {
  id: number;
  range: string;
  categoryName: string;
  percentage: number;
  records: number;
}

const categoryArr: Category[] = [
  { id: 1, range: "1-5", categoryName: "cat1", percentage: 0.5, records: 10 },
  { id: 2, range: "6-10", categoryName: "cat2", percentage: 0.1, records: 20 },
  { id: 3, range: "11-15", categoryName: "cat2", percentage: 0.1, records: 30 },
  { id: 4, range: "16-20", categoryName: "cat3", percentage: 0.4, records: 40 },
  { id: 5, range: "21-25", categoryName: "cat3", percentage: 0.4, records: 50 },
  { id: 6, range: "26-30", categoryName: "cat3", percentage: 0.4, records: 60 },
];

const getRows = (people: Category[]): Row[] => [
  // header row
  {
    rowIndex: 0,
    height: 40,
  },
  // data rows
  ...people.map((_, i) => ({
    rowIndex: i + 1,
    height: 40,
  })),
];

const getColumns = (): Column[] => [
  { colIndex: 0, width: 220 },
  { colIndex: 1, width: 220 },
  { colIndex: 2, width: 220 },
  { colIndex: 3, width: 220 },
];

type UpdateCategoryFn = <T>(id: number, key: string, newValue: T) => void;

const generateCells = (categories: Category[], updateCategories: UpdateCategoryFn): Cell[] => {
  const generateHeaderCells = () => {
    const titles = ["Range", "Category", "Category %", "Records"];

    return titles.map((title, colIndex) => ({
      rowIndex: 0,
      colIndex,
      Template: NonEditableCell,
      props: {
        value: title,
        style: cellsStyles.header,
      },
    }));
  };

  // Spanned cells index
  const spannedCellsIdx = [
    { rowIndex: 2, colIndex: 1, rowSpan: 2 },
    { rowIndex: 2, colIndex: 2, rowSpan: 2 },
    { rowIndex: 4, colIndex: 1, rowSpan: 3 },
    { rowIndex: 4, colIndex: 2, rowSpan: 3 },
  ];

  const isCellOverlappingSpan = (rowIndex: number, colIndex: number): boolean => {
    return spannedCellsIdx.some(({ rowIndex: spanRow, colIndex: spanCol, rowSpan }) => {
      return colIndex === spanCol && rowIndex > spanRow && rowIndex < spanRow + rowSpan;
    });
  };

  const getSpan = (rowIndex: number, colIndex: number) => {
    const spannedCell = spannedCellsIdx.find((cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex);
    return spannedCell ? { rowSpan: spannedCell.rowSpan } : {};
  };

  const generateRowCells = (rowIndex: number, category: Category): Cell[] => {
    const { id, range, categoryName, percentage, records } = category;

    return [
      {
        rowIndex,
        colIndex: 0,
        Template: TextCell,
        props: {
          text: range,
          onTextChanged: (newText: string) => updateCategories(id, "range", newText),
        },
      },
      {
        rowIndex,
        colIndex: 1,
        Template: TextCell,
        props: {
          text: categoryName,
          onTextChanged: (newValue: string) => updateCategories(id, "categoryName", newValue),
        },
        ...getSpan(rowIndex, 1), // Check if this is a spanned cell
      },
      {
        rowIndex,
        colIndex: 2,
        Template: NumberCell,
        props: {
          value: percentage,
          onValueChanged: (newValue: number) => updateCategories(id, "percentage", newValue),
          format: new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 0 }),
        },
        ...getSpan(rowIndex, 2), // Check if this is a spanned cell
      },
      {
        rowIndex,
        colIndex: 3,
        Template: NumberCell,
        props: {
          value: records,
          onValueChanged: (newValue: number) => updateCategories(id, "records", newValue),
        },
      },
    ].filter((cell) => !isCellOverlappingSpan(cell.rowIndex, cell.colIndex)); // Filter out only overlapping cells
  };

  const headerCells = generateHeaderCells();
  const rowCells = categories.flatMap((category, idx) => generateRowCells(idx + 1, category));

  return [...headerCells, ...rowCells];
};

export const SpannedCellsExample = () => {
  const [categories, setCategories] = useState<Category[]>(categoryArr);

  const updateCategories = (id: number, key: string, newValue) => {
    setCategories((prevData) =>
      prevData.map((category) => (category.id !== id ? category : { ...category, [key]: newValue }))
    );
  };

  const rows = getRows(categories);
  const columns = getColumns();
  const cells = generateCells(categories, updateCategories);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <ReactGrid
        id="spanned-cells-example"
        enableColumnSelectionOnFirstRow
        moveRightOnEnter={true}
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
