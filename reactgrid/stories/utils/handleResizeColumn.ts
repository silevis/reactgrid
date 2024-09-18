import { Dispatch, SetStateAction } from "react";
import { Column } from "../../lib/main";
import { ColumnDef } from "./examplesConfig";

export const handleResizeColumn = (
  newWidth: number,
  columnIndexes: number[],
  setColumns: Dispatch<SetStateAction<ColumnDef[]>>
) => {
  setColumns((prevColumns) => {
    const widthPerColumn = columnIndexes.length > 1 ? newWidth / columnIndexes.length : newWidth;

    return prevColumns.map((column, idx) => {
      if (columnIndexes.includes(idx)) {
        return { ...column, width: widthPerColumn };
      }

      return column;
    });
  });
};
