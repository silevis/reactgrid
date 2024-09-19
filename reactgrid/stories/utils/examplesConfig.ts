/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cell, Column, NonEditableCell, Row } from "../../lib/main";

export interface RowDef {
  rowIndex: number;
  height: number;
  reorderable?: boolean;
}

export interface ColumnDef {
  title: string;
  width: number;
  cellTemplate: React.ComponentType<any>;
}

interface CellMatrixDef {
  cells: Cell[];
  rows: Row[];
  columns: Column[];
}

export const generateDataTable = (
  people: Person[],
  updatePerson: (id, selector, p) => void,
  columnDefs: ColumnDef[]
): CellMatrixDef => {
  const cells: Cell[] = [];

  const rowsWithAssignedHeights = people.map((person, i) => ({
    id: person._id,
    height: 40,
    position: person.position,
  }));

  const headerRow = [{ id: "header", position: 0, height: 40 }];

  const orderedRows: RowDef[] = [...headerRow, ...rowsWithAssignedHeights]
    .sort((a, b) => a.position - b.position)
    .map((row) => {
      const idx = rowsWithAssignedHeights.findIndex((r) => r.id === row.id);
      const adjustedIdx = idx === -1 ? 0 : idx + 1;

      if (adjustedIdx === 0) {
        return { rowIndex: adjustedIdx, height: row.height, reorderable: false };
      }

      return { rowIndex: adjustedIdx, height: row.height };
    });

  orderedRows.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      columnDefs.forEach((col, colIndex) => {
        cells.push({
          rowIndex,
          colIndex,
          Template: NonEditableCell,
          props: {
            value: col.title,
            style: {
              backgroundColor: "#55bc71",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            },
          },
          isSelectable: false,
        });
      });
    } else {
      const personRowIndex = row.rowIndex - 1;

      const personCells = columnDefs.map((col) => {
        const numberCellProps = {
          onValueChanged: (newValue) => {
            updatePerson(people[personRowIndex]._id, col.title, newValue);
          },
          value: people[personRowIndex][col.title],
        };

        const textCellProps = {
          text: people[personRowIndex][col.title],
          onTextChanged: (newText: string) => {
            updatePerson(people[personRowIndex]._id, col.title, newText);
          },
        };

        return {
          Template: col.cellTemplate,
          props: col.title === "age" ? numberCellProps : textCellProps,
        };
      });

      columnDefs.forEach((_, colIndex) => {
        cells.push({
          rowIndex,
          colIndex,
          ...personCells[colIndex],
        });
      });
    }
  });

  // Rows that are actually used in the grid
  const gridRows = orderedRows.map((rowDef, index) => {
    if (index === 0) {
      return { rowIndex: index, height: rowDef.height, ...(rowDef.reorderable === false && { reorderable: false }) };
    }
    return { rowIndex: index, height: rowDef.height };
  });

  // Columns that are actually used in the grid
  const gridColumns = columnDefs.map((col, index) => ({
    colIndex: index,
    width: col.width,
  }));

  return { rows: gridRows, columns: gridColumns, cells };
};

export interface Person {
  _id: string;
  name: string;
  age: number;
  email: string;
  company: string;
  position: number;
}

export const peopleArr: Person[] = [
  {
    _id: "66d61077035753f369ddbb16",
    name: "Jordan Rodriquez",
    age: 30,
    email: "jordanrodriquez@cincyr.com",
    company: "Zaggles",
    position: 1,
  },
  {
    _id: "66d61077794e7949ab167fd5",
    email: "allysonrios@satiance.com",
    name: "Allyson Rios",
    age: 30,
    company: "Zoxy",
    position: 2,
  },
  {
    _id: "66d61077dd754e88981ae434",
    name: "Pickett Lucas",
    age: 25,
    email: "pickettlucas@zoxy.com",
    company: "Techade",
    position: 3,
  },
  {
    _id: "66d61077115e2f8748c334d9",
    name: "Louella David",
    age: 37,
    email: "louelladavid@techade.com",
    company: "Ginkogene",
    position: 4,
  },
  {
    _id: "66d61077540d53374b427e4b",
    name: "Tricia Greene",
    age: 27,
    email: "triciagreene@ginkogene.com",
    company: "Naxdis",
    position: 5,
  },
];

export const rgStyles = {
  focusIndicator: {
    border: {
      color: "#32a852",
      width: "2px",
      style: "solid",
    },
  },
  selectionIndicator: {
    background: "rgba(144, 238, 144, 0.1)",
    border: {
      color: "#81df9b",
      style: "solid",
    },
  },
  fillHandle: {
    background: "transparent",
    border: {
      color: "#32a852",
      style: "dashed",
    },
  },
  line: {
    backgroundColor: "#81df9b",
  },
  gridWrapper: {
    fontFamily: "Roboto, sans-serif",
  },
};
