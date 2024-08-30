import { CellData, NonEditableCell, NumberCell, TextCell } from "../../lib/main";

export const headerRow = ["Name", "Surname", "Email", "Phone"];

export const dataRows = [
  ["Jake", "Smith", "j.smith@gmail.com", "987654321"],
  ["Emily", "Jones", "e.jones@hotmail.com", "4561237890"],
  ["Liam", "Brown", "l.brown@yahoo.com", "321456987"],
  ["Sophia", "Taylor", "s.taylor@gmail.com", "6547891230"],
  ["Mason", "Lee", "m.lee@outlook.com", "789456123"],
  ["Isabella", "Wilson", "i.wilson@gmail.com", "123789456"],
];

export const initialGridData: CellData[] = [headerRow, ...dataRows].flatMap((row, rowIdx) =>
  row.map((cellValue, colIdx) => {
    if (rowIdx === 0) {
      return {
        rowIndex: rowIdx,
        colIndex: colIdx,
        Template: NonEditableCell,
        // isFocusable: false,
        // isSelectable: false,
        props: {
          value: cellValue,
          style: {
            backgroundColor: "#55bc71",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          },
        },
      };
    }

    if (colIdx === row.length - 1 && rowIdx !== 0) {
      return {
        rowIndex: rowIdx,
        colIndex: colIdx,
        Template: NumberCell,
        props: {
          value: cellValue,
          validator: (value) => !isNaN(value),
          errorMessage: "ERR",
          hideZero: true,
        },
      };
    }

    return { rowIndex: rowIdx, colIndex: colIdx, Template: TextCell, props: { value: cellValue } };
  })
);

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
