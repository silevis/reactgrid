import React, { Dispatch, SetStateAction } from "react";
import { StrictMode, useState } from "react";
import { Cell, Column, NonEditableCell, NumberCell, ReactGrid, TextCell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, peopleArr, getRows, cellsStyles, Person } from "./utils/examplesConfig";
import { handleColumnReorder } from "./utils/handleColumnReorder";

type ColumnDef = {
  colIndex: number;
  width: string | number;
  title: string;
  minWidth?: string | number;
  resizable?: boolean;
  reorderable?: boolean;
};

// Columns with fields 'title' will be used for column reordering
const getColumns = (): ColumnDef[] => [
  { colIndex: 0, width: 220, title: "Name" },
  { colIndex: 1, width: 220, title: "Age" },
  { colIndex: 2, width: 220, title: "Email" },
  { colIndex: 3, width: 220, title: "Company" },
];

type UpdatePersonFn = <T>(id: string, key: string, newValue: T) => void;

export const generateCells = (people: Person[], columns: ColumnDef[], updatePerson: UpdatePersonFn): Cell[] => {
  const generateHeaderCells = () => {
    return columns.map((column, colIdx) => ({
      rowIndex: 0,
      colIndex: colIdx,
      Template: NonEditableCell,
      props: {
        value: column.title,
        style: cellsStyles.header,
      },
    }));
  };

  const generateRowCells = (rowIndex: number, person: Person): Cell[] => {
    const { id, name, age, email, company } = person;

    const nameColIndex = columns.findIndex((col) => col.title === "Name");
    const ageColIndex = columns.findIndex((col) => col.title === "Age");
    const emailColIndex = columns.findIndex((col) => col.title === "Email");
    const companyColIndex = columns.findIndex((col) => col.title === "Company");

    return [
      {
        rowIndex,
        colIndex: nameColIndex,
        Template: TextCell,
        props: {
          text: name,
          onTextChanged: (newText: string) => updatePerson(id, "name", newText),
        },
      },
      {
        rowIndex,
        colIndex: ageColIndex,
        Template: NumberCell,
        props: {
          value: age,
          onValueChanged: (newValue: number) => updatePerson(id, "age", newValue),
        },
      },
      {
        rowIndex,
        colIndex: emailColIndex,
        Template: TextCell,
        props: {
          text: email,
          onTextChanged: (newText: string) => updatePerson(id, "email", newText),
        },
      },
      {
        rowIndex,
        colIndex: companyColIndex,
        Template: TextCell,
        props: {
          text: company,
          onTextChanged: (newText: string) => updatePerson(id, "company", newText),
        },
      },
    ];
  };

  const headerCells = generateHeaderCells();

  const rowCells = people.flatMap((person, idx) => generateRowCells(idx + 1, person));

  return [...headerCells, ...rowCells];
};

const handleResizeColumn = (
  newWidth: number,
  columnIndexes: number[],
  setColumns: Dispatch<SetStateAction<ColumnDef[]>>
) => {
  setColumns((prevColumns) => {
    const widthPerColumn = columnIndexes.length > 1 ? newWidth / columnIndexes.length : newWidth;

    return prevColumns.map((column, idx) => {
      if (columnIndexes.includes(idx)) {
        return { ...column, width: widthPerColumn };
      }

      return column;
    });
  });
};

export const ColumnReorderExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p.id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const rows = getRows(people);
  const [columns, setColumns] = useState(getColumns());
  const cells = generateCells(people, columns, updatePerson);

  // Remove the 'title' field to follow the Column type
  const gridColumns: Column[] = columns.filter((col) => {
    const { title, ...columnFields } = col;
    return columnFields;
  });

  return (
    <div>
      <ReactGrid
        id="column-reorder-example"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        onColumnReorder={(selectedColIndexes, destinationColIdx) =>
          handleColumnReorder(selectedColIndexes, destinationColIdx, setColumns)
        }
        onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, setColumns)}
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        rows={rows}
        columns={gridColumns}
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
