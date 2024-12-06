export type ColumnDef = {
  colIndex: number;
  width: string | number;
  title: string;
  minWidth?: string | number;
  resizable?: boolean;
  reorderable?: boolean;
};

export const handleColumnReorder = (
  selectedColIndexes: number[],
  destinationColIdx: number,
  setColumns: React.Dispatch<React.SetStateAction<ColumnDef[]>>
) => {
  setColumns((prevColumns) => {
    // Filter out the selected columns and unselected columns
    const selectedColumns = prevColumns.filter((_, index) => selectedColIndexes.includes(index));
    const unselectedColumns = prevColumns.filter((_, index) => !selectedColIndexes.includes(index));

    // Adjust the destination index based on the direction of the reorder
    const adjustedDestinationColIdx =
      selectedColIndexes[0] > destinationColIdx ? destinationColIdx : destinationColIdx - selectedColumns.length + 1;

    // Create the new columns array with reordered columns
    const newColumns = [
      ...unselectedColumns.slice(0, adjustedDestinationColIdx),
      ...selectedColumns,
      ...unselectedColumns.slice(adjustedDestinationColIdx),
    ];

    return newColumns;
  });
};
