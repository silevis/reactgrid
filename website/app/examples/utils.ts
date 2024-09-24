import { Cell, Column, NonEditableCell, NumberCell } from "@silevis/reactgrid";

export type MonthlyValues = number[];

const COL_WIDTH = 110;

export function getColumns(): Column[] {
  return [
    {
      colIndex: 0,
      width: 200,
    },
    { colIndex: 1, width: COL_WIDTH },
    { colIndex: 2, width: COL_WIDTH },
    { colIndex: 3, width: COL_WIDTH },
    { colIndex: 4, width: COL_WIDTH },
    { colIndex: 5, width: COL_WIDTH },
    { colIndex: 6, width: COL_WIDTH },
    { colIndex: 7, width: COL_WIDTH },
    { colIndex: 8, width: COL_WIDTH },
    { colIndex: 9, width: COL_WIDTH },
    { colIndex: 10, width: COL_WIDTH },
    { colIndex: 11, width: COL_WIDTH },
    { colIndex: 12, width: COL_WIDTH },
    {
      colIndex: 13,
      width: 120,
    },
  ];
}

export interface InputVariables {
  cashInflow: CashInflow[];
  cashOutflow: CashOutflow[];
  openingBalance: number;
  creditLine: number;
}

export interface OutputVariables {
  cashboxBank: MonthlyValues;
  monthlyInflowTotals: MonthlyValues;
  monthlyOutflowTotals: MonthlyValues;
  yearlyInflowTotal: number;
  yearlyOutflowTotal: number;
  monthlyInflowOuflowDiffs: MonthlyValues;
  cumulativeTotals: MonthlyValues;
  yearlyInflowOuflowDiff: number;
}

const getCashboxBankCells = (
  rowIndex: number,
  title: string,
  cashboxBank: MonthlyValues
) => {
  const getCashboxBankCell = (
    rowIndex: number,
    colIndex: number,
    Template: React.ComponentType<any>,
    props: React.ComponentPropsWithRef<Cell["Template"]>,
    style?: React.CSSProperties
  ) => ({
    rowIndex,
    colIndex,
    Template,
    props,
  });

  return [
    getCashboxBankCell(rowIndex, 0, NonEditableCell, { value: title }),
    ...emptyMonthsValues.map((values, idx) =>
      idx === 0
        ? getCashboxBankCell(rowIndex, idx + 1, NumberCell, {
            value: cashboxBank[idx],
          })
        : getCashboxBankCell(rowIndex, idx + 1, NonEditableCell, {
            value: cashboxBank[idx],
          })
    ),
    getCashboxBankCell(rowIndex, 13, NonEditableCell, {}),
  ];
};

export const getCells = ({
  cashInflow,
  cashOutflow,
  cashboxBank,
  monthlyInflowTotals,
  monthlyOutflowTotals,
  yearlyInflowOuflowDiff,
  yearlyInflowTotal,
  yearlyOutflowTotal,
  monthlyInflowOuflowDiffs,
  cumulativeTotals,
  creditLine,
}: InputVariables & OutputVariables) => {
  const cells = [
    ...headerCells,
    liquidFundsCells,
    getCashboxBankRow("Cashbox/bank", cashboxBank),
    ...getGroupRows(
      "Inflow",
      "Cash in (total)",
      cashInflow,
      monthlyInflowTotals,
      yearlyInflowTotal
    ),
    ...getGroupRows(
      "Outflow",
      "Cash out (total)",
      cashOutflow,
      monthlyOutflowTotals,
      yearlyOutflowTotal
    ),
    getMonthsTotalRow(
      "Total",
      monthlyInflowOuflowDiffs,
      yearlyInflowOuflowDiff
    ),
    getCumulativeRow("Cumulative", cumulativeTotals, yearlyInflowOuflowDiff),
    ...getCreditLineRows(cumulativeTotals, yearlyInflowOuflowDiff, creditLine),
  ];
};

const getMonthHeaderCell = (
  rowIndex: number,
  colIndex: number,
  text: string,
  style?: React.CSSProperties
) => ({
  rowIndex,
  colIndex,
  Template: NonEditableCell,
  props: {
    text,
    style,
  },
});

const getLiquidFundsCell = (
  rowIndex: number,
  colIndex: number,
  text: string,
  style?: React.CSSProperties
) => ({
  rowIndex,
  colIndex,
  Template: NonEditableCell,
  props: {
    text,
    style,
  },
});

export const headerCells = [
  getMonthHeaderCell(0, 0, ""),
  getMonthHeaderCell(0, 1, "Jan"),
  getMonthHeaderCell(0, 2, "Feb"),
  getMonthHeaderCell(0, 3, "Mar"),
  getMonthHeaderCell(0, 4, "Apr"),
  getMonthHeaderCell(0, 5, "May"),
  getMonthHeaderCell(0, 6, "Jun"),
  getMonthHeaderCell(0, 7, "Jul"),
  getMonthHeaderCell(0, 8, "Aug"),
  getMonthHeaderCell(0, 9, "Sep"),
  getMonthHeaderCell(0, 10, "Oct"),
  getMonthHeaderCell(0, 11, "Nov"),
  getMonthHeaderCell(0, 12, "Dec"),
  getMonthHeaderCell(0, 13, "Totals"),
];

export const liquidFundsCells = [
  getLiquidFundsCell(1, 0, "Opening balance"),
  getLiquidFundsCell(1, 1, ""),
  getLiquidFundsCell(1, 2, ""),
  getLiquidFundsCell(1, 3, ""),
  getLiquidFundsCell(1, 4, ""),
  getLiquidFundsCell(1, 5, ""),
  getLiquidFundsCell(1, 6, ""),
  getLiquidFundsCell(1, 7, ""),
  getLiquidFundsCell(1, 8, ""),
  getLiquidFundsCell(1, 9, ""),
  getLiquidFundsCell(1, 10, ""),
  getLiquidFundsCell(1, 11, ""),
  getLiquidFundsCell(1, 12, ""),
  getLiquidFundsCell(1, 13, ""),
];

const emptyMonthsValues: MonthlyValues = Array(12).fill(NaN);

const toFixed = (n: number, fixed: number) =>
  ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);

export function months(): number[] {
  return new Array(12).fill(0);
}

function generateRandomValues(value: number, variation: number) {
  const min = value - variation;
  const max = value + variation;
  return months().map(() => toFixed(Math.random() * (max - min + 1) + min, 2));
}

export type Inflow =
  | "Sales"
  | "Other income"
  | "Loan disbursement"
  | "Private deposits/equity"
  | "Other incoming payments";

export type Outflow =
  | "Use of goods/materials"
  | "Personnel costs"
  | "Room costs / rent"
  | "Heating, electricity, water, gas"
  | "Marketing and advertisement"
  | "Vehicle costs (operational)"
  | "Traveling expenses"
  | "Telephone, Fax, Internet"
  | "Office supplies, packaging"
  | "Repairs, maintenance"
  | "Insurance (company)"
  | "Contributions and fees"
  | "Leasing"
  | "Advice and bookkeeping"
  | "Cost of capital / interest"
  | "Repayment (loan)";

export type Group<T> = {
  title: T;
  values: MonthlyValues;
};

export type CashInflow = Group<Inflow>;
export type CashOutflow = Group<Outflow>;

export interface InputVariables {
  cashInflow: CashInflow[];
  cashOutflow: CashOutflow[];
  openingBalance: number;
  creditLine: number;
}

export interface OutputVariables {
  cashboxBank: MonthlyValues;
  monthlyInflowTotals: MonthlyValues;
  monthlyOutflowTotals: MonthlyValues;
  yearlyInflowTotal: number;
  yearlyOutflowTotal: number;
  monthlyInflowOuflowDiffs: MonthlyValues;
  cumulativeTotals: MonthlyValues;
  yearlyInflowOuflowDiff: number;
}

const sumGroupInAMonth =
  (group: (CashInflow | CashOutflow)[]) =>
  (monthIndex: number): number =>
    group.reduce(
      (acc, { values }) =>
        acc + (isNaN(values[monthIndex]) ? 0 : values[monthIndex]),
      0
    );

const calcMonthlyGroupTotals = (
  group: (CashInflow | CashOutflow)[]
): MonthlyValues => months().map((_, idx) => sumGroupInAMonth(group)(idx));

export function calculateOutputVariables(
  inputVariables: InputVariables
): OutputVariables {
  const {
    cashInflow,
    cashOutflow,
    openingBalance,
    // creditLine
  } = inputVariables;
  const monthlyInflowTotals = calcMonthlyGroupTotals(cashInflow);
  const monthlyOutflowTotals = calcMonthlyGroupTotals(cashOutflow);

  const cashboxBank = months().map(
    (_, idx, array) =>
      (array[idx + 1] =
        idx === 0
          ? openingBalance
          : array[idx] +
            monthlyInflowTotals[idx - 1] -
            monthlyOutflowTotals[idx - 1])
  );

  const cumulativeTotals = months().map(
    (_, idx) =>
      (isNaN(cashboxBank[idx]) ? 0 : cashboxBank[idx]) +
      monthlyInflowTotals[idx] -
      monthlyOutflowTotals[idx]
  );

  const yearlyInflowTotal = monthlyInflowTotals.reduce((a, b) => a + b);
  const yearlyOutflowTotal = monthlyOutflowTotals.reduce((a, b) => a + b);

  const yearlyInflowOuflowDiff = yearlyInflowTotal - yearlyOutflowTotal;

  const monthlyInflowOuflowDiffs = months().map(
    (_, idx) => monthlyInflowTotals[idx] - monthlyOutflowTotals[idx]
  );

  return {
    yearlyInflowTotal,
    yearlyOutflowTotal,
    cumulativeTotals,
    monthlyInflowTotals,
    monthlyOutflowTotals,
    cashboxBank,
    yearlyInflowOuflowDiff,
    monthlyInflowOuflowDiffs,
  };
}

export const inflows: CashInflow[] = [
  {
    title: "Sales",
    values: generateRandomValues(32000, 5000),
  },
  {
    title: "Loan disbursement",
    values: generateRandomValues(5000, 1000),
  },
  {
    title: "Private deposits/equity",
    values: generateRandomValues(500, 500),
  },
  {
    title: "Other incoming payments",
    values: generateRandomValues(7000, 100),
  },
  {
    title: "Other income",
    values: emptyMonthsValues,
  },
];

export const outflows: CashOutflow[] = [
  {
    title: "Use of goods/materials",
    values: generateRandomValues(2000, 100),
  },
  {
    title: "Heating, electricity, water, gas",
    values: generateRandomValues(1000, 100),
  },
  {
    title: "Personnel costs",
    values: generateRandomValues(1000, 100),
  },
  {
    title: "Room costs / rent",
    values: generateRandomValues(7000, 100),
  },
  {
    title: "Marketing and advertisement",
    values: generateRandomValues(5000, 500),
  },
  {
    title: "Vehicle costs (operational)",
    values: generateRandomValues(3000, 1900),
  },
  {
    title: "Traveling expenses",
    values: generateRandomValues(5000, 500),
  },
  {
    title: "Telephone, Fax, Internet",
    values: generateRandomValues(5000, 500),
  },
  {
    title: "Office supplies, packaging",
    values: generateRandomValues(5000, 500),
  },
  {
    title: "Repairs, maintenance",
    values: generateRandomValues(1000, 500),
  },
  {
    title: "Insurance (company)",
    values: generateRandomValues(5000, 500),
  },
  {
    title: "Contributions and fees",
    values: generateRandomValues(1000, 500),
  },
  {
    title: "Leasing",
    values: generateRandomValues(1000, 500),
  },
  {
    title: "Advice and bookkeeping",
    values: generateRandomValues(5000, 0),
  },
  {
    title: "Cost of capital / interest",
    values: generateRandomValues(1000, 500),
  },
  {
    title: "Repayment (loan)",
    values: generateRandomValues(1000, 500),
  },
];
