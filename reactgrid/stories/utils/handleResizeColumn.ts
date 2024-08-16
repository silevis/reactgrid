import { Dispatch, SetStateAction } from "react";
import { Column } from "../../lib/main";

export const handleResizeColumn = (
  newWidth: number,
  columnIdx: number,
  setColumns: Dispatch<SetStateAction<Column[]>>
) => {
  setColumns((prevColumns) =>
    prevColumns.map((column, idx) => {
      if (idx === columnIdx) {
        return { ...column, width: `${newWidth}px` };
      }

      return column;
    })
  );
};
