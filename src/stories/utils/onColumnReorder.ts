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
    const newGridData = prevGridData.map((row, idx) => {
      const newRow = [...row];

      if (!selectedColIndexes.includes(destinationColIdx)) {
        const reorderDirection = selectedColIndexes.find((idx) => idx > destinationColIdx) ? "left" : "right";

        const movedItems = selectedColIndexes.map((selectedColIndex) => newRow[selectedColIndex]);

        const sortedSelectedColIndexes = [...selectedColIndexes].sort((a, b) => b - a);

        sortedSelectedColIndexes.forEach((selectedColIndex) => {
          newRow.splice(selectedColIndex, 1);
        });

        // Adjust destination index if it's greater than the selected column indexes
        const adjustedDestinationColIdx =
          reorderDirection === "right" ? destinationColIdx - sortedSelectedColIndexes.length + 1 : destinationColIdx;

        movedItems.forEach((item, index) => {
          newRow.splice(adjustedDestinationColIdx + index, 0, item);
        });
      }

      return newRow;
    });

    return newGridData;
  });
};
