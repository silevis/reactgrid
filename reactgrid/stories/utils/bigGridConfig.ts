import { CellData, TextCell, NumberCell } from "../../lib/main";

export const styledRanges = [
  {
    range: { start: { rowIndex: 0, columnIndex: 5 }, end: { rowIndex: 14, columnIndex: 12 } },
    styles: { background: "red", color: "yellow" },
  },
  {
    range: { start: { rowIndex: 7, columnIndex: 10 }, end: { rowIndex: 10, columnIndex: 14 } },
    styles: { background: "green", color: "purple" },
  },
];

export const ROW_COUNT = 20;
export const COLUMN_COUNT = 25;

export const testStyles = {
  gridWrapper: {
    fontSize: "16px",
    fontFamily: "Arial",
  },
};

const myNumberFormat = new Intl.NumberFormat("pl", {
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currency: "PLN",
});

export const generateCellData = (i: number, j: number): CellData | null => {
  if (i === 1 && j === 4) return null;
  if (i === 1 && j === 24) return null;
  if (i === 3 && j === 4) return null;
  if (i === 4 && j === 3) return null;
  if (i === 4 && j === 4) return null;
  if (i === 5 && j === 6) return null;
  if (i === 5 && j === 7) return null;
  if (i === 6 && j === 4) return null;
  if (i === 6 && j === 7) return null;
  if (i === 6 && j === 8) return null;
  if (i === 19 && j === 1) return null;
  if (i === 1 && j === 24) return null;

  const cellIdx = {
    rowIndex: i,
    colIndex: j,
  };

  if (i === 0) return { ...cellIdx, props: { value: `Col ${j}` }, Template: TextCell, isFocusable: false };
  if (i === 5 && j === 3) return { ...cellIdx, props: { value: 100, format: myNumberFormat }, Template: NumberCell };
  if (i === 1 && j === 3)
    return {
      ...cellIdx,
      props: { value: "Lorem ipsum dolor sit amet" },
      Template: TextCell,
      colSpan: 2,
    };
  if (i === 1 && j === 23)
    return {
      ...cellIdx,
      props: { value: "Lorem ipsum dolor sit amet" },
      Template: TextCell,
      colSpan: 2,
    };
  if (i === 3 && j === 3)
    return { ...cellIdx, props: { value: "Lorem ipsum dolor sit amet" }, Template: TextCell, colSpan: 2, rowSpan: 2 };
  if (i === 5 && j === 4)
    return {
      ...cellIdx,
      props: { value: "Reiciendis illum, nihil, ab officiis explicabo!" },

      Template: TextCell,
      rowSpan: 2,
    };
  if (i === 5 && j === 5)
    return {
      ...cellIdx,
      props: { value: "Excepturi in adipisci omnis illo eveniet obcaecati!" },
      Template: TextCell,
      colSpan: 3,
    };
  if (i === 6 && j === 6) return { ...cellIdx, props: { value: "Doloremque, sit!" }, Template: TextCell, colSpan: 3 };
  if (i === 18 && j === 1) return { ...cellIdx, props: { value: "Doloremque, sit!" }, Template: TextCell, rowSpan: 2 };

  if (i > 0 && j === 0) {
    return {
      ...cellIdx,
      props: {
        value:
          `[${i.toString()}:${j.toString()}]` +
          [
            "Lorem ipsum dolor sit amet",
            "Reiciendis illum, nihil, ab officiis explicabo!",
            "Excepturi in adipisci omnis illo eveniet obcaecati!",
            "Doloremque, sit!",
          ][Math.floor(Math.random() * 4)],
      },
      Template: TextCell,
      isFocusable: false,
    };
  }

  return {
    ...cellIdx,
    props: {
      value:
        `[${i.toString()}:${j.toString()}]` +
        [
          "Lorem ipsum dolor sit amet",
          "Reiciendis illum, nihil, ab officiis explicabo!",
          "Excepturi in adipisci omnis illo eveniet obcaecati!",
          "Doloremque, sit!",
        ][Math.floor(Math.random() * 4)],
    },
    Template: TextCell,
  };
};
