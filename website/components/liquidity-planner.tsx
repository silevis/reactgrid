import {
  calculateOutputVariables,
  getColumns,
  inflows,
  InputVariables,
  outflows,
  OutputVariables,
} from "@/app/examples/utils";
import { useState } from "react";

export interface RowDef {
  rowIndex: number;
  height: number;
  isExpandable: boolean;
  reorderable?: boolean;
}

interface ColumnDef {
  colIndex: number;
  title: string;
  width: number;
}

const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const LiquidityPlanner = () => {
  const [openingBalance, setOpeningBalance] = useState(0);
  const [creditLine, setCreditLine] = useState(3000);
  const [cashInflow, setCashInflow] = useState(inflows);
  const [cashOutflow, setCashOutflow] = useState(outflows);

  const inputVariables: InputVariables = {
    cashInflow,
    cashOutflow,
    openingBalance,
    creditLine,
  };

  const outputVariables = calculateOutputVariables(inputVariables);
  const plannerData: InputVariables & OutputVariables = {
    ...inputVariables,
    ...outputVariables,
  };

  const columns = getColumns();

  //   const cells = getCells();

  console.log({ inputVariables, outputVariables });

  console.log({ plannerData });

  return <div></div>;
};
