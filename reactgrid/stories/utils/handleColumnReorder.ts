import { Cell, Column } from "../../lib/main";

export const handleColumnReorder = (
  selectedColIndexes: number[],
  destinationColIdx: number,
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  setCells: React.Dispatch<React.SetStateAction<Cell[]>>
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

  setCells((prevCells) => {
    const minSelectedIndex = Math.min(...selectedColIndexes);
    const maxSelectedIndex = Math.max(...selectedColIndexes);
    const movingRight = destinationColIdx > maxSelectedIndex;

    return prevCells.map((cell) => {
      const { colIndex } = cell;

      if (selectedColIndexes.includes(colIndex)) {
        // Calculate new index for cells being moved
        const offset = selectedColIndexes.indexOf(colIndex);
        const newColIndex = movingRight
          ? destinationColIdx - (selectedColIndexes.length - 1 - offset)
          : destinationColIdx + offset;
        return { ...cell, colIndex: newColIndex };
      }

      // Shift other cells between selected columns and destination
      if (movingRight && colIndex > maxSelectedIndex && colIndex <= destinationColIdx) {
        return { ...cell, colIndex: colIndex - selectedColIndexes.length };
      }

      if (!movingRight && colIndex < minSelectedIndex && colIndex >= destinationColIdx) {
        return { ...cell, colIndex: colIndex + selectedColIndexes.length };
      }

      return cell; // Unaffected cells
    });
  });
};
