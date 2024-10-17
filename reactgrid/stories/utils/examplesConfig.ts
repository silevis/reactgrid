/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cell, Column, NonEditableCell, NumberCell, RGThemeType, Row, TextCell } from "../../lib/main";

export const cellStyles = {
  header: {
    backgroundColor: "#55bc71",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
};

export const getRows = (people: Person[]): Row[] => [
  // header row
  {
    rowIndex: 0,
    height: 40,
    reorderable: false,
  },
  // data rows
  ...people.map((_, i) => ({
    rowIndex: i + 1,
    height: 40,
  })),
];

export const getColumns = (): Column[] => [
  { colIndex: 0, width: 220 },
  { colIndex: 1, width: 220 },
  { colIndex: 2, width: 220 },
  { colIndex: 3, width: 220 },
];

type UpdatePersonFn = <T>(id: string, key: string, newValue: T) => void;

export const generateCells = (people: Person[], updatePerson: UpdatePersonFn): Cell[] => {
  const generateHeaderCells = () => {
    const titles = ["Name", "Age", "Email", "Company"];

    return titles.map((title, colIndex) => ({
      rowIndex: 0,
      colIndex,
      Template: NonEditableCell,
      props: {
        value: title,
        style: cellStyles.header,
      },
    }));
  };

  const generateRowCells = (rowIndex: number, person: Person): Cell[] => {
    const { id, name, age, email, company } = person;

    return [
      {
        rowIndex,
        colIndex: 0,
        Template: TextCell,
        props: {
          text: name,
          onTextChanged: (newText: string) => updatePerson(id, "name", newText),
        },
      },
      {
        rowIndex,
        colIndex: 1,
        Template: NumberCell,
        props: {
          value: age,
          onValueChanged: (newValue: number) => updatePerson(id, "age", newValue),
        },
      },
      {
        rowIndex,
        colIndex: 2,
        Template: TextCell,
        props: {
          text: email,
          onTextChanged: (newText: string) => updatePerson(id, "email", newText),
        },
      },
      {
        rowIndex,
        colIndex: 3,
        Template: TextCell,
        props: {
          text: company,
          onTextChanged: (newText: string) => updatePerson(id, "company", newText),
        },
      },
    ];
  };

  const headerCells = generateHeaderCells();

  people.sort((a, b) => a.position - b.position);

  const rowCells = people.flatMap((person, idx) => generateRowCells(idx + 1, person));

  return [...headerCells, ...rowCells];
};

export interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
  company: string;
  position: number;
}

export const peopleArr: Person[] = [
  {
    id: "66d61077035753f369ddbb16",
    name: "Jordan Rodriquez",
    age: 30,
    email: "jordanrodriquez@cincyr.com",
    company: "Zaggles",
    position: 1,
  },
  {
    id: "66d61077794e7949ab167fd5",
    email: "allysonrios@satiance.com",
    name: "Allyson Rios",
    age: 30,
    company: "Zoxy",
    position: 2,
  },
  {
    id: "66d61077dd754e88981ae434",
    name: "Pickett Lucas",
    age: 25,
    email: "pickettlucas@zoxy.com",
    company: "Techade",
    position: 3,
  },
  {
    id: "66d61077115e2f8748c334d9",
    name: "Louella David",
    age: 37,
    email: "louelladavid@techade.com",
    company: "Ginkogene",
    position: 4,
  },
  {
    id: "66d61077540d53374b427e4b",
    name: "Tricia Greene",
    age: 27,
    email: "triciagreene@ginkogene.com",
    company: "Naxdis",
    position: 5,
  },
];

export const rgStyles: RGThemeType = {
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
  paneContainer: {
    top: {},
    bottom: {},
    left: {},
    right: {},
  },
};
