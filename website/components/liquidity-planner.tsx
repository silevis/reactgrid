import {
  calculateOutputVariables,
  getCells,
  getColumns,
  inflows,
  InputVariables,
  outflows,
  OutputVariables,
} from "@/app/demo/utils";
import { ReactGrid, RGTheme } from "@silevis/reactgrid";
import React, { useEffect, useState } from "react";

export interface RowDef {
  rowIndex: number;
  height: number;
  isExpandable: boolean;
  reorderable?: boolean;
}

export const LiquidityPlanner = () => {
  const [openingBalance, setOpeningBalance] = useState(10000);
  const [creditLine, setCreditLine] = useState(3000);
  const [cashInflow, setCashInflow] = useState(inflows);
  const [cashOutflow, setCashOutflow] = useState(outflows);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log("isMobile", isMobile);

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

  const cells = getCells(plannerData, {
    setOpeningBalance,
    setCreditLine,
    setCashInflow,
    setCashOutflow,
  });

  const rows = cells.map((cell) => ({
    rowIndex: cell.rowIndex,
    height: 35,
  }));

  const columns = getColumns();

  return (
    <ReactGrid
      cells={cells}
      rows={rows}
      columns={columns}
      stickyTopRows={1}
      stickyLeftColumns={!isMobile ? 1 : 0}
      stickyRightColumns={!isMobile ? 1 : 0}
      enableRowSelectionOnFirstColumn
      styles={gridStyles}
    />
  );
};

const gridStyles = {
  grid: {
    gap: {
      color: "#f0f0f0",
    },
  },
  gridWrapper: {
    fontSize: "14px",
    color: "#000",
    fontWeight: "300",
    fontFamily: "Arial",
  },
  paneContainer: {
    top: {
      background: "#fff",
    },
    left: {
      background: "#fff",
      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
    },
    right: {
      background: "#fff",
      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
    },
  },
  cellContainer: {
    background: "#fafbfc",
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
};
