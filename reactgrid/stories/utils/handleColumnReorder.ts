import { Column } from "../../lib/types/PublicModel";

export const handleColumnReorder = (
  selectedColIndexes: number[],
  destinationColIdx: number,
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>
) => {
  setColumns((prevColumns) => {
    const selectedColumns = prevColumns.filter((_, index) => selectedColIndexes.includes(index));
    const unselectedColumns = prevColumns.filter((_, index) => !selectedColIndexes.includes(index));

    // calculate the adjusted destination index
    const adjustedDestinationColIdx =
      selectedColIndexes[0] > destinationColIdx ? destinationColIdx : destinationColIdx - selectedColumns.length + 1;

    // create the new array of columns
    const newColumns = [
      ...unselectedColumns.slice(0, adjustedDestinationColIdx),
      ...selectedColumns,
      ...unselectedColumns.slice(adjustedDestinationColIdx),
    ];

    // update colIndex for each column
    return newColumns.map((col, index) => ({ ...col, colIndex: index }));
  });
};
