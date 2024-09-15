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
  rowDefs: RowDef[],
  columnDefs: ColumnDef[]
): CellMatrixDef => {
  const cells: Cell[] = [];

  rowDefs.forEach((row, rowIndex) => {
    const personRowIndex = row.rowIndex;

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
        });
      });
    } else {
      const personCells = columnDefs.map((col) => {
        const numberCellProps = {
          onValueChanged: (newValue) => {
            updatePerson(people[personRowIndex - 1]._id, col.title, newValue);
          },
          value: people[personRowIndex - 1][col.title.toLowerCase()],
        };

        const textCellProps = {
          text: people[personRowIndex - 1][col.title.toLowerCase()],
          onTextChanged: (newText: string) => {
            updatePerson(people[personRowIndex - 1]._id, col.title, newText);
          },
        };

        return {
          Template: col.cellTemplate,
          props: col.title === "age" ? { ...numberCellProps } : { ...textCellProps },
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

  const rows = rowDefs.map((rowDef, index) => ({
    rowIndex: index,
    height: rowDef.height,
    ...(rowDef.reorderable === false && { reorderable: false }),
  }));

  const columns = columnDefs.map((col, index) => ({
    colIndex: index,
    width: col.width,
  }));

  return { rows, columns, cells };
};

export interface Person {
  _id: string;
  name: string;
  age: number;
  email: string;
  company: string;
}

export const peopleArr: Person[] = [
  {
    _id: "66d61077035753f369ddbb16",
    name: "Jordan Rodriquez",
    age: 30,
    email: "jordanrodriquez@cincyr.com",
    company: "Zaggles",
  },
  {
    _id: "66d61077794e7949ab167fd5",
    email: "allysonrios@satiance.com",
    name: "Allyson Rios",
    age: 30,
    company: "Zoxy",
  },
  {
    _id: "66d61077dd754e88981ae434",
    name: "Pickett Lucas",
    age: 25,
    email: "pickettlucas@zoxy.com",
    company: "Techade",
  },
  {
    _id: "66d61077115e2f8748c334d9",
    name: "Louella David",
    age: 37,
    email: "louelladavid@techade.com",
    company: "Ginkogene",
  },
  {
    _id: "66d61077540d53374b427e4b",
    name: "Tricia Greene",
    age: 27,
    email: "triciagreene@ginkogene.com",
    company: "Naxdis",
  },
];

export const rgStyles = {
  font: {
    size: "24px",
    family: "Roboto",
  },
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
