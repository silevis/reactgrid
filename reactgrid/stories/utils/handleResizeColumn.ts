import { Dispatch, SetStateAction } from "react";
import { CellMatrix } from "../../lib/types/CellMatrix";
import { Column } from "../../lib/types/PublicModel";

export const handleResizeColumn = (
  width: number,
  columnIdx: number,
  cells: CellMatrix,
  setColumns: Dispatch<SetStateAction<Column[]>>
) => {
  setColumns((prevColumns) =>
    prevColumns.map((column, idx) => {
      if (idx !== columnIdx) return column;

      const cell = cells[0][columnIdx];
      let newWidth = width;

      if ("colSpan" in cell && cell.colSpan) {
        for (let i = columnIdx + 1; i < columnIdx + cell.colSpan; i++) {
          const columnWidth = prevColumns[i].width;
          // Parse the column width in case it is a string (e.g., "100px")
          const columnWidthNumber = typeof columnWidth === "string" ? parseInt(columnWidth, 10) : columnWidth;
          newWidth -= columnWidthNumber;
        }
      }

      return { ...column, width: `${newWidth}px` };
    })
  );
};
