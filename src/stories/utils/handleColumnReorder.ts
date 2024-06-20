import { Dispatch, SetStateAction } from "react";
import { Column } from "../../types/PublicModel";

type CellData = {
  text?: string;
  number?: number;
  date?: Date;
};

type SetData<T extends CellData> = React.Dispatch<React.SetStateAction<(T | null)[][]>>;

export const handleColumnReorder = (
  selectedColIndexes: number[],
  destinationColIdx: number,
  setColumns: Dispatch<SetStateAction<Column<string>[]>>,
  setData: SetData<CellData>
) => {
  setColumns((prevColumns) => {
    // Create arrays of selected and unselected columns
    const selectedColumns = prevColumns.filter((_, index) => selectedColIndexes.includes(index));
    const unselectedColumns = prevColumns.filter((_, index) => !selectedColIndexes.includes(index));

    // Calculate the adjusted destination index
    const adjustedDestinationColIdx =
      selectedColIndexes[0] > destinationColIdx ? destinationColIdx : destinationColIdx - selectedColumns.length + 1;

    // Create the new array of columns
    const newColumns = [
      ...unselectedColumns.slice(0, adjustedDestinationColIdx),
      ...selectedColumns,
      ...unselectedColumns.slice(adjustedDestinationColIdx),
    ];

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
