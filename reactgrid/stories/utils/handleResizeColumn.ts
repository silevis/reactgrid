import { Dispatch, SetStateAction } from "react";
import { Column } from "../../lib/main";

export const handleResizeColumn = (
  newWidth: number,
  columnIndexes: number[],
  setColumns: Dispatch<SetStateAction<Column[]>>
) => {
  setColumns((prevColumns) => {
    // if resizing multiple columns, divide the new width by the number of columns
    const newWidthPerColumn = columnIndexes.length > 1 ? newWidth / columnIndexes.length : newWidth;

    return prevColumns.map((column, idx) => {
      if (columnIndexes.includes(idx)) {
        return { ...column, width: newWidthPerColumn };
      }

      return column;
    });
  });
};
