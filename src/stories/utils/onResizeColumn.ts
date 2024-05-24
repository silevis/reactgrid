import { Dispatch, SetStateAction } from "react";
import { CellMatrix } from "../../types/CellMatrix";
import { Column } from "../../types/PublicModel";

export const onResizeColumn = (
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
              if (typeof prevColumns[i].width === "string") {
                const widthString = prevColumns[i].width as string;
                newWidth -= parseInt(widthString, 10);
              } else if (typeof prevColumns[i].width === "number") {
                const widthNumber = prevColumns[i].width as number;
                newWidth -= widthNumber;
              }
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
