import { Column, HeaderCell, NumberCell, Row, TextCell } from "../../lib/main";

export const initialColumns: Column[] = [
  { width: "150px", resizable: true, reorderable: true, minWidth: 50 },
  { width: "150px", resizable: true, reorderable: true, minWidth: 50 },
  { width: "150px", resizable: true, reorderable: true, minWidth: 50 },
  { width: "150px", resizable: true, reorderable: true, minWidth: 50 },
];

export const initialRows: Row[] = Array.from({ length: 7 }, (_, idx) => {
  if (idx === 0) return { height: "30px", reorderable: false };

  return { height: "min-content", reorderable: true };
});

export const headerRow = ["Name", "Surname", "Email", "Phone"];

export const dataRows = [
  ["Jake", "Smith", "j.smith@gmail.com", "987654321"],
  ["Emily", "Jones", "e.jones@hotmail.com", "4561237890"],
  ["Liam", "Brown", "l.brown@yahoo.com", "321456987"],
  ["Sophia", "Taylor", "s.taylor@gmail.com", "6547891230"],
  ["Mason", "Lee", "m.lee@outlook.com", "789456123"],
  ["Isabella", "Wilson", "i.wilson@gmail.com", "123789456"],
];

export const initialGridData: CellData[][] = [headerRow, ...dataRows].map((row, rowIdx) =>
  row.map((cellValue, index) => {
    if (rowIdx === 0) {
      return {
        type: "text",
        value: cellValue,
        template: HeaderCell,
        isFocusable: false,
        isSelectable: false,
        style: {
          backgroundColor: "#55bc71",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        },
      };
    }

    if (index === row.length - 1 && rowIdx !== 0) {
      return {
        type: "number",
        value: cellValue,
        template: NumberCell,
        validator: (value) => !isNaN(value),
        errorMessage: "ERR",
        hideZero: true,
      };
    }

    return { type: "text", value: cellValue, template: TextCell };
  })
);

export interface CellData {
  type: "text" | "number" | "date";
  value: string | number | Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: React.ComponentType<any>;

  style?: React.CSSProperties;

  rowSpan?: number;
  colSpan?: number;

  isFocusable?: boolean;
  isSelectable?: boolean;

  validator?: (value: number) => boolean;
  errorMessage?: string;
  hideZero?: boolean;
}

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
