import { Dispatch, SetStateAction } from "react";
import { Column } from "../../types/PublicModel";

type CellData = {
  text?: string;
  number?: number;
  date?: Date;
};

type SetData<T extends CellData> = React.Dispatch<React.SetStateAction<(T | null)[][]>>;

export const onColumnReorder = <T>(
  selectedColIndexes: number[],
  destinationColIdx: number,
  setColumns: Dispatch<SetStateAction<Column<string>[]>>,
  setData: SetData<CellData>
) => {
  setColumns((prevColumns) => {
    const nonSelectedColIndexes = prevColumns.map((_, idx) => idx).filter((idx) => !selectedColIndexes.includes(idx));

    nonSelectedColIndexes.splice(destinationColIdx, 0, ...selectedColIndexes);

    const newColumns = nonSelectedColIndexes.map((idx) => prevColumns[idx]);

    return newColumns;
  });

  setData((prevGridData) => {
    const newGridData = prevGridData.map((row) => {
      const newRow = [...row];
      selectedColIndexes.forEach((selectedColIndex) => {
        const movedItem = newRow.splice(selectedColIndex, 1)[0];
        newRow.splice(destinationColIdx, 0, movedItem);
      });
      return newRow;
    });
    return newGridData;
  });
};
