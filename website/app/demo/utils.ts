import { Cell, Column, NonEditableCell, NumberCell } from "@silevis/reactgrid";
import { Dispatch, SetStateAction } from "react";
import {
  cashboxBankCellEditableStyle,
  cashboxBankCellStyle,
  creditCellStyle,
  creditEditableCellStyle,
  creditLineOverdraftCellStyle,
  creditLineOverdraftNameCellStyle,
  cumulativeCellStyle,
  cumulativeNameCellStyle,
  emptyHeaderCellStyle,
  groupHeaderCellStyle,
  groupMonthSummaryCellStyle,
  groupMonthValueCellStyle,
  groupRowNameCellStyle,
  headerCellsStyle,
  summaryTitleCellStyle,
  totalCellStyle,
  totalNameCellStyle,
} from "./gridStyles";

export type MonthlyValues = number[];

const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const COL_WIDTH = 150;

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

export function months(): number[] {
  return new Array(12).fill(0);
}

export function getColumns(): Column[] {
  return [
    {
      colIndex: 0,
      width: 250,
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
  cashboxBank: MonthlyValues,
  setOpeningBalance: Dispatch<SetStateAction<number>>
) => {
  const getCashboxBankCell = (
    rowIndex: number,
    colIndex: number,
    Template: React.ComponentType<any>,
    props: React.ComponentPropsWithRef<Cell["Template"]>
  ) => ({
    rowIndex,
    colIndex,
    Template,
    props,
  });

  return [
    getCashboxBankCell(rowIndex, 0, NonEditableCell, {
      value: title,
      style: groupRowNameCellStyle,
    }),
    ...months().map((values, idx) =>
      idx === 0
        ? getCashboxBankCell(rowIndex, idx + 1, NumberCell, {
            value: cashboxBank[idx],
            onValueChanged: (value: number) => setOpeningBalance(value),
            format: numberFormat,
            style: cashboxBankCellEditableStyle,
          })
        : getCashboxBankCell(rowIndex, idx + 1, NonEditableCell, {
            value: numberFormat.format(cashboxBank[idx]),
            style: cashboxBankCellStyle,
          })
    ),
    getCashboxBankCell(rowIndex, 13, NonEditableCell, {}),
  ];
};

const getGroupCells = (
  startRowIdx: number,
  grouptitle: "Inflow" | "Outflow",
  summaryTitle: string,
  groups: (CashInflow | CashOutflow)[],
  monthlyGroupTotals: MonthlyValues,
  yearlyGroupTotal: number,
  updateData: Dispatch<SetStateAction<any>>
): Cell[] => {
  const createGroupHeaderCells = (
    template: any,
    value: any,
    rowIdx: number
  ): Cell[] => {
    return [
      {
        rowIndex: rowIdx,
        colIndex: 0,
        Template: template,
        props: { value: value, style: groupHeaderCellStyle },
      },
      ...months().map((_, idx) => ({
        rowIndex: rowIdx,
        colIndex: idx + 1,
        Template: template,
        props: { value: "", style: emptyHeaderCellStyle },
      })),
      {
        rowIndex: rowIdx,
        colIndex: 13,
        Template: template,
        props: { value: "", style: emptyHeaderCellStyle },
      },
    ];
  };

  const createGroupSummaryCells = (rowIdx: number): Cell[] => {
    return [
      {
        rowIndex: rowIdx,
        colIndex: 0,
        Template: NonEditableCell,
        props: { value: summaryTitle, style: summaryTitleCellStyle },
      },
      ...months().map((_, idx) => ({
        rowIndex: rowIdx,
        colIndex: idx + 1,
        Template: NonEditableCell,
        props: {
          value: numberFormat.format(monthlyGroupTotals[idx]),
          style: groupMonthSummaryCellStyle,
        },
      })),
      {
        rowIndex: rowIdx,
        colIndex: 13,
        Template: NonEditableCell,
        props: {
          value: numberFormat.format(yearlyGroupTotal),
          style: groupMonthSummaryCellStyle,
        },
      },
    ];
  };

  const groupCells = groups.flatMap((group, idx) => [
    {
      rowIndex: startRowIdx + idx + 1,
      colIndex: 0,
      Template: NonEditableCell,
      props: { value: group.title, style: groupRowNameCellStyle },
    },
    ...group.values.map((value, colIdx) => {
      if (group.title === "Other income") {
        return {
          rowIndex: startRowIdx + idx + 1,
          colIndex: colIdx + 1,
          Template: NumberCell,
          props: {
            value: group.values[colIdx] || 0,
            onValueChanged: (value: number) => {
              updateData((prev: (CashInflow | CashOutflow)[]) => {
                const newCashInflow = [...prev];
                newCashInflow[idx].values[colIdx] = value;
                return newCashInflow;
              });
            },
            hideZero: true,
            format: numberFormat,
            style: groupMonthValueCellStyle,
          },
        };
      }

      return {
        rowIndex: startRowIdx + idx + 1,
        colIndex: colIdx + 1,
        Template: NumberCell,
        props: {
          value: group.values[colIdx] || "",
          onValueChanged: (value: number) => {
            updateData((prev: (CashInflow | CashOutflow)[]) => {
              const newCashInflow = [...prev];
              newCashInflow[idx].values[colIdx] = value;
              return newCashInflow;
            });
          },
          format: numberFormat,
          style: groupMonthValueCellStyle,
        },
      };
    }),
    {
      rowIndex: startRowIdx + idx + 1,
      colIndex: 13,
      Template: NonEditableCell,
      props: {
        value: numberFormat.format(sumGroupValues(group.values)),
        style: groupMonthSummaryCellStyle,
      },
    },
  ]);

  return [
    ...createGroupHeaderCells(NonEditableCell, grouptitle, startRowIdx),
    ...groupCells,
    ...createGroupSummaryCells(startRowIdx + groups.length + 1),
  ];
};

function sumGroupValues(values: MonthlyValues): number {
  return values.reduce(
    (prev, curr) => (isNaN(prev) ? 0 : prev) + (isNaN(curr) ? 0 : curr)
  );
}

export const getCells = (
  plannerData: InputVariables & OutputVariables,
  handlers: {
    setOpeningBalance: Dispatch<SetStateAction<number>>;
    setCreditLine: Dispatch<SetStateAction<number>>;
    setCashInflow: Dispatch<SetStateAction<CashInflow[]>>;
    setCashOutflow: Dispatch<SetStateAction<CashOutflow[]>>;
  }
) => {
  const cashboxBankStartRowIdx = 2;
  const inflowStartRowIdx = cashboxBankStartRowIdx + 1;
  const outflowStartRowIdx =
    inflowStartRowIdx + plannerData.cashInflow.length + 2;
  const totalStartRowIdx =
    outflowStartRowIdx + plannerData.cashOutflow.length + 2;
  const cumulativeStartRowIdx = totalStartRowIdx + 1;
  const creditLineStartRowIdx = cumulativeStartRowIdx + 1;

  const cells = [
    ...headerCells,
    ...liquidFundsCells,
    ...getCashboxBankCells(
      cashboxBankStartRowIdx,
      "Cashbox/bank",
      plannerData.cashboxBank,
      handlers.setOpeningBalance
    ),
    ...getGroupCells(
      inflowStartRowIdx,
      "Inflow",
      "Cash in (total)",
      plannerData.cashInflow,
      plannerData.monthlyInflowTotals,
      plannerData.yearlyInflowTotal,
      handlers.setCashInflow
    ),
    ...getGroupCells(
      outflowStartRowIdx,
      "Outflow",
      "Cash out (total)",
      plannerData.cashOutflow,
      plannerData.monthlyOutflowTotals,
      plannerData.yearlyOutflowTotal,
      handlers.setCashOutflow
    ),
    ...getMonthsTotalCells(
      totalStartRowIdx,
      "Total",
      plannerData.monthlyInflowOuflowDiffs,
      plannerData.yearlyInflowOuflowDiff
    ),
    ...getCumulativeCells(
      cumulativeStartRowIdx,
      "Cumulative",
      plannerData.cumulativeTotals,
      plannerData.yearlyInflowOuflowDiff
    ),
    ...getCreditLineCells(
      creditLineStartRowIdx,
      plannerData.cumulativeTotals,
      plannerData.yearlyInflowOuflowDiff,
      plannerData.creditLine,
      handlers.setCreditLine
    ),
  ];

  return cells;
};

const getCreditLineCells = (
  startRowIdx: number,
  cumulativeTotals: MonthlyValues,
  yearlyInflowOuflowDiff: number,
  creditLine: number,
  setCreditLine: Dispatch<SetStateAction<number>>
) => {
  const yearlyOverdraft =
    -yearlyInflowOuflowDiff - (isNaN(creditLine) ? 0 : creditLine);

  const getCreditLineCell = (
    rowIndex: number,
    colIndex: number,
    value: string,
    style?: React.CSSProperties
  ) => ({
    rowIndex,
    colIndex,
    Template: NonEditableCell,
    props: {
      value,
      style,
    },
  });

  const creditLineCells = [
    getCreditLineCell(startRowIdx, 0, "Credit line", groupRowNameCellStyle),
    ...months().map((_, idx) =>
      idx === 0
        ? {
            rowIndex: startRowIdx,
            colIndex: idx + 1,
            Template: NumberCell,
            props: {
              onValueChanged: (value: number) => setCreditLine(value),
              value: creditLine,
              style: creditEditableCellStyle,
            },
          }
        : getCreditLineCell(
            startRowIdx,
            idx + 1,
            creditLine.toString(),
            creditCellStyle
          )
    ),
    getCreditLineCell(
      startRowIdx,
      13,
      creditLine.toString(),
      groupMonthSummaryCellStyle
    ),
  ];

  const creditLineOverdraftCells = [
    getCreditLineCell(
      startRowIdx + 1,
      0,
      "Credit line overdraft",
      creditLineOverdraftNameCellStyle
    ),
    ...months().map((_, idx) => {
      const overdraft =
        -cumulativeTotals[idx] - (isNaN(creditLine) ? 0 : creditLine);
      return getCreditLineCell(
        startRowIdx + 1,
        idx + 1,
        overdraft > 0 ? numberFormat.format(overdraft) : "",
        creditLineOverdraftCellStyle
      );
    }),
    getCreditLineCell(
      startRowIdx + 1,
      13,
      yearlyOverdraft > 0 ? numberFormat.format(yearlyOverdraft) : "",
      creditLineOverdraftCellStyle
    ),
  ];

  return [...creditLineCells, ...creditLineOverdraftCells];
};

const getCumulativeCells = (
  startRowIdx: number,
  title: string,
  cumulativeTotals: MonthlyValues,
  yearlyInflowOuflowDiff: number
) => {
  const getCumulativeCell = (
    rowIndex: number,
    colIndex: number,
    value: string,
    style?: React.CSSProperties
  ) => ({
    rowIndex,
    colIndex,
    Template: NonEditableCell,
    props: {
      value,
      style,
    },
  });

  return [
    getCumulativeCell(startRowIdx, 0, title, cumulativeNameCellStyle),
    ...months().map((_, idx) => ({
      rowIndex: startRowIdx,
      colIndex: idx + 1,
      Template: NonEditableCell,
      props: {
        value: numberFormat.format(cumulativeTotals[idx]),
        style: cumulativeCellStyle,
      },
    })),
    getCumulativeCell(
      startRowIdx,
      13,
      numberFormat.format(yearlyInflowOuflowDiff),
      cumulativeCellStyle
    ),
  ];
};

const getMonthsTotalCells = (
  startRowIdx: number,
  title: string,
  monthlyInflowOuflowDiffs: MonthlyValues,
  yearlyInflowOuflowDiff: number
) => {
  const getMonthsTotalCell = (
    rowIndex: number,
    colIndex: number,
    value: string,
    style?: React.CSSProperties
  ) => ({
    rowIndex,
    colIndex,
    Template: NonEditableCell,
    props: {
      value,
      style,
    },
  });

  return [
    getMonthsTotalCell(startRowIdx, 0, title, totalNameCellStyle),
    ...months().map((_, idx) => ({
      rowIndex: startRowIdx,
      colIndex: idx + 1,
      Template: NonEditableCell,
      props: {
        value: numberFormat.format(monthlyInflowOuflowDiffs[idx]),
        style: totalCellStyle,
      },
    })),
    getMonthsTotalCell(
      startRowIdx,
      13,
      numberFormat.format(yearlyInflowOuflowDiff),
      totalCellStyle
    ),
  ];
};

const getMonthHeaderCell = (
  rowIndex: number,
  colIndex: number,
  value: string,
  style?: React.CSSProperties
) => ({
  rowIndex,
  colIndex,
  Template: NonEditableCell,
  props: {
    value,
    style,
  },
  isSelectable: false,
});

const getLiquidFundsCell = (
  rowIndex: number,
  colIndex: number,
  value: string,
  style?: React.CSSProperties
) => ({
  rowIndex,
  colIndex,
  Template: NonEditableCell,
  props: {
    value,
    style,
  },
});

export const headerCells = [
  getMonthHeaderCell(0, 0, ""),
  getMonthHeaderCell(0, 1, "Jan", headerCellsStyle),
  getMonthHeaderCell(0, 2, "Feb", headerCellsStyle),
  getMonthHeaderCell(0, 3, "Mar", headerCellsStyle),
  getMonthHeaderCell(0, 4, "Apr", headerCellsStyle),
  getMonthHeaderCell(0, 5, "May", headerCellsStyle),
  getMonthHeaderCell(0, 6, "Jun", headerCellsStyle),
  getMonthHeaderCell(0, 7, "Jul", headerCellsStyle),
  getMonthHeaderCell(0, 8, "Aug", headerCellsStyle),
  getMonthHeaderCell(0, 9, "Sep", headerCellsStyle),
  getMonthHeaderCell(0, 10, "Oct", headerCellsStyle),
  getMonthHeaderCell(0, 11, "Nov", headerCellsStyle),
  getMonthHeaderCell(0, 12, "Dec", headerCellsStyle),
  getMonthHeaderCell(0, 13, "Totals", {
    ...headerCellsStyle,
    justifyContent: "flex-end",
    paddingRight: 15,
  }),
];

export const liquidFundsCells = [
  getLiquidFundsCell(1, 0, "Liquid funds", {
    ...groupHeaderCellStyle,
    ...emptyHeaderCellStyle,
  }),
  getLiquidFundsCell(1, 1, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 2, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 3, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 4, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 5, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 6, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 7, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 8, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 9, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 10, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 11, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 12, "", emptyHeaderCellStyle),
  getLiquidFundsCell(1, 13, "", emptyHeaderCellStyle),
];

const emptyMonthsValues: MonthlyValues = Array(12).fill(NaN);

const toFixed = (n: number, fixed: number) =>
  ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);

function generateRandomValues(value: number, variation: number) {
  const min = value - variation;
  const max = value + variation;
  return months().map(() => toFixed(Math.random() * (max - min + 1) + min, 2));
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
