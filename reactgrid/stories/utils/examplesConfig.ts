import { Cell, Column, NonEditableCell, NumberCell, Row, TextCell } from "../../lib/main";

const headers = ["Name", "Age", "Email", "Company"];

export const generateCells = (
  rows: Row[],
  columns: Column[],
  people: Person[],
  updatePerson: (id, selector, p) => void
): Cell[] => {
  const cells: Cell[] = [];

  // data cells based on the reordered columns
  rows.forEach((row, rowIndex) => {
    const personRowIndex = row.initialRowIndex ?? rowIndex;

    // check if the current row is the header row
    if (rowIndex === 0) {
      columns.forEach((col, colIndex) => {
        cells.push({
          rowIndex,
          colIndex,
          Template: NonEditableCell,
          props: {
            value: headers[col.initialColIndex ?? colIndex],
            readOnly: true,
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
      const personCells = [
        {
          Template: TextCell,
          props: {
            text: people[personRowIndex].name,
            onTextChanged: (newName: string) => {
              updatePerson(people[personRowIndex]._id, "name", newName);
            },
          },
        },
        {
          Template: NumberCell,
          props: {
            onValueChanged: (newAge: number) => {
              updatePerson(people[personRowIndex]._id, "age", newAge);
            },
            value: people[personRowIndex].age,
            validator: (value) => !isNaN(value),
            errorMessage: "ERR",
            hideZero: true,
          },
        },
        {
          Template: TextCell,
          props: {
            text: people[personRowIndex].email,
            onTextChanged: (email: string) => {
              updatePerson(people[personRowIndex]._id, "email", email);
            },
          },
        },
        {
          Template: TextCell,
          props: {
            text: people[personRowIndex].company,
            onTextChanged: (company: string) => {
              updatePerson(people[personRowIndex]._id, "company", company);
            },
          },
        },
      ];

      columns.forEach((col, colIndex) => {
        cells.push({
          rowIndex,
          colIndex,
          ...personCells[col.initialColIndex ?? colIndex],
        });
      });
    }
  });

  return cells;
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
