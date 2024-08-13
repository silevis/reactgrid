import { Dispatch, SetStateAction } from "react";
import { CellData, Column } from "../../lib/types/PublicModel";

export const handleColumnReorder = <T extends CellData>(
  selectedColIndexes: number[],
  destinationColIdx: number,
  setColumns: Dispatch<SetStateAction<Column[]>>,
  setData: React.Dispatch<React.SetStateAction<T[]>>
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
    const minSelectedIndex = Math.min(...selectedColIndexes);
    const maxSelectedIndex = Math.max(...selectedColIndexes);
    const reorderDirection = destinationColIdx > minSelectedIndex ? "right" : "left";

    const newGridData = prevGridData.map((cell) => {
      if (cell === null) return cell;

      const { colIndex } = cell;

      if (selectedColIndexes.includes(colIndex)) {
        const offset =
          reorderDirection === "right"
            ? selectedColIndexes.length - 1 - selectedColIndexes.indexOf(colIndex)
            : selectedColIndexes.indexOf(colIndex);

        const newColIndex = reorderDirection === "right" ? destinationColIdx - offset : destinationColIdx + offset;

        return {
          ...cell,
          colIndex: newColIndex,
        };
      }

      if (reorderDirection === "right") {
        // Reordering to the right
        if (colIndex >= minSelectedIndex && colIndex <= destinationColIdx) {
          const newColIndex = colIndex - selectedColIndexes.length;
          return {
            ...cell,
            colIndex: newColIndex,
          };
        }
      } else if (reorderDirection === "left") {
        // Reordering to the left
        if (colIndex >= destinationColIdx && colIndex <= maxSelectedIndex) {
          const newColIndex = colIndex + selectedColIndexes.length;
          return {
            ...cell,
            colIndex: newColIndex,
          };
        }
      }

      return cell;
    });

    return newGridData;
  });
};
