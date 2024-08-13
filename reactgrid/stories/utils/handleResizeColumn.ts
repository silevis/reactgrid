import { Dispatch, SetStateAction } from "react";
import { CellData } from "../../lib/types/PublicModel";

type Column = {
  colIndex: number;
  width: string | number;
  minWidth?: string | number;
  resizable?: boolean;
  reorderable?: boolean;
};

export const handleResizeColumn = (width: number, columnIdx: number, cells: CellData[], columns: Column[]) => {
  return columns.map((column, idx) => {
    if (idx !== columnIdx) return column;

    const cell = cells.find((cell) => cell.rowIndex === 0 && cell.colIndex === columnIdx);

    if (!cell) return column;

    let newWidth = width;

    if ("colSpan" in cell && cell.colSpan) {
      for (let i = columnIdx + 1; i < columnIdx + cell.colSpan; i++) {
        const columnWidth = columns[i].width;
        // Parse the column width in case it is a string (e.g., "100px")
        const columnWidthNumber = typeof columnWidth === "string" ? parseInt(columnWidth, 10) : columnWidth;
        newWidth -= columnWidthNumber;
      }
    }

    return { ...column, width: `${newWidth}px` };
  });
};
