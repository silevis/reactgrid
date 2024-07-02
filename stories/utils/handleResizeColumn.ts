import { Dispatch, SetStateAction } from "react";
import { CellMatrix } from "../../lib/types/CellMatrix";
import { Column } from "../../lib/types/PublicModel";
import { getNumberFromPixelString } from "../../lib/utils/getNumberFromPixelValueString";

export const handleResizeColumn = (
  width: number,
  columnId: string | number,
  cellMatrix: CellMatrix<string, string>,
  setColumns: Dispatch<SetStateAction<Column<string>[]>>
) => {
  // TODO: adjust line min position for spanned columns
  setColumns((prevColumns) => {
    return prevColumns.map((column, columnIdx) => {
      if (column.id === columnId) {
        const cell = cellMatrix.cells.get(`0 ${columnId}`);
        if (cell && "colSpan" in cell) {
          let newWidth = width;
          if (cell.colSpan) {
            for (let i = columnIdx + 1; i < columnIdx + cell.colSpan; i++) {
              const widthValue = getNumberFromPixelString(prevColumns[i].width);
              newWidth -= widthValue;
            }
          }
          return { ...column, width: `${newWidth}px` };
        } else {
          return { ...column, width: `${width}px` };
        }
      }
      return column;
    });
  });
};
