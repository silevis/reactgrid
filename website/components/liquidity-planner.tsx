import {
  calculateOutputVariables,
  getCells,
  getColumns,
  inflows,
  InputVariables,
  outflows,
  OutputVariables,
} from "@/app/examples/utils";
import { ReactGrid } from "@silevis/reactgrid";
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

export const LiquidityPlanner = () => {
  const [openingBalance, setOpeningBalance] = useState(10000);
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

  const cells = getCells(plannerData, {
    setOpeningBalance,
    setCreditLine,
    setCashInflow,
    setCashOutflow,
  });

  console.log("cells: ", cells);

  console.log({ inputVariables, outputVariables });

  console.log({ plannerData });

  return (
    <ReactGrid
      cells={cells}
      stickyLeftColumns={1}
      stickyRightColumns={1}
      enableRowSelectionOnFirstColumn
      styles={{
        gridWrapper: {
          fontSize: "14px",
          color: "#000",
          fontWeight: "300",
          fontFamily: "Arial",
        },
        paneContainer: {
          left: {
            background: "#fff",
          },
        },
      }}
    />
  );
};
