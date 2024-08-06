import { Dispatch, SetStateAction } from "react";
import { CellMatrix } from "../../lib/types/CellMatrix";
import { Column } from "../../lib/types/PublicModel";
import { getNumberFromPixelString } from "../../lib/utils/getNumberFromPixelValueString";

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
          newWidth -= getNumberFromPixelString(prevColumns[i].width);
        }
      }

      return { ...column, width: `${newWidth}px` };
    })
  );
};
