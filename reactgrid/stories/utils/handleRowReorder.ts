import { CellData, Row } from "../../lib/types/PublicModel";

export const handleRowReorder = <T extends CellData>(
  selectedRowIndexes: number[],
  destinationRowIdx: number,
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
) => {
  setRows((prevRows) => {
    // create arrays of selected and unselected rows
    const selectedRows = prevRows.filter((_, index) => selectedRowIndexes.includes(index));
    const unselectedRows = prevRows.filter((_, index) => !selectedRowIndexes.includes(index));

    // calculate the adjusted destination index
    const adjustedDestinationRowIdx =
      selectedRowIndexes[0] > destinationRowIdx ? destinationRowIdx : destinationRowIdx - selectedRows.length + 1;

    // create the new array of rows
    const newRows = [
      ...unselectedRows.slice(0, adjustedDestinationRowIdx),
      ...selectedRows,
      ...unselectedRows.slice(adjustedDestinationRowIdx),
    ];

    return newRows;
  });

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
        // reordering down
        if (rowIndex >= minSelectedIndex && rowIndex <= destinationRowIdx) {
          const newRowIndex = rowIndex - selectedRowIndexes.length;
          return {
            ...cell,
            rowIndex: newRowIndex,
          };
        }
      } else if (reorderDirection === "up") {
        //  reordering up
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
