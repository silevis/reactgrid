import React from "react";
import {
  CellTemplate,
  Uncertain,
  Compatible,
  Cell,
  CellStyle,
} from "@silevis/reactgrid";

export interface DisabledCell extends Cell {
  type: "disabled";
  text?: string;
  value?: number;
}

export const DisabledCellTemplate: CellTemplate<DisabledCell> = {
  getCompatibleCell(
    uncertainCell: Uncertain<DisabledCell>
  ): Compatible<DisabledCell> {
    return {
      ...uncertainCell,
      text: uncertainCell.text || "",
      value: uncertainCell.value || parseFloat(uncertainCell.text || "0"),
    };
  },
  render(cell: Compatible<DisabledCell>): React.ReactNode {
    return (
      <div className={cell.className}>
        {cell.text || (cell.value !== 0 && cell.value)}
      </div>
    );
  },
};

export const getDisabledCell = (
  value: string | number,
  style?: CellStyle,
  className?: string
): DisabledCell => ({
  type: "disabled",
  text: typeof value === "string" ? value : "",
  value: typeof value === "number" ? value : 0,
  style,
  className,
});
