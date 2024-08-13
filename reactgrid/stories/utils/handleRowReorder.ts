import { CellData } from "../../lib/types/PublicModel";

export const handleRowReorder = <T extends CellData>(
  selectedRowIndexes: number[],
  destinationRowIdx: number,
  setData: React.Dispatch<React.SetStateAction<T[]>>
) => {
  setData((prevGridData) => {
    const minSelectedIndex = Math.min(...selectedRowIndexes);
    const maxSelectedIndex = Math.max(...selectedRowIndexes);
    const reorderDirection = destinationRowIdx > minSelectedIndex ? "down" : "up";

    const newGridData = prevGridData.map((cell) => {
      if (cell === null) return cell;

      const { rowIndex } = cell;

      if (selectedRowIndexes.includes(rowIndex)) {
        const offset =
          reorderDirection === "down"
            ? selectedRowIndexes.length - 1 - selectedRowIndexes.indexOf(rowIndex)
            : selectedRowIndexes.indexOf(rowIndex);

        const newRowIndex = reorderDirection === "down" ? destinationRowIdx - offset : destinationRowIdx + offset;

        return {
          ...cell,
          rowIndex: newRowIndex,
        };
      }

      if (reorderDirection === "down") {
        // Reordering down
        if (rowIndex >= minSelectedIndex && rowIndex <= destinationRowIdx) {
          const newRowIndex = rowIndex - selectedRowIndexes.length;
          return {
            ...cell,
            rowIndex: newRowIndex,
          };
        }
      } else if (reorderDirection === "up") {
        // Reordering up
        if (rowIndex >= destinationRowIdx && rowIndex <= maxSelectedIndex) {
          const newRowIndex = rowIndex + selectedRowIndexes.length;
          return {
            ...cell,
            rowIndex: newRowIndex,
          };
        }
      }

      return cell;
    });

    return newGridData;
  });
};
