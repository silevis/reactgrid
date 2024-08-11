import { Dispatch, SetStateAction } from "react";
import { Row } from "../../lib/types/PublicModel";
import { CellData } from "./examplesConfig";

export const handleRowReorder = <T extends CellData>(
  selectedRowIndexes: number[],
  destinationRowIdx: number,
  setRows: Dispatch<SetStateAction<Row[]>>,
  setData: React.Dispatch<React.SetStateAction<T[][]>>
) => {
  setRows((prevRows) => {
    // Create arrays of selected and unselected rows
    const selectedRows = prevRows.filter((_, index) => selectedRowIndexes.includes(index));
    const unselectedRows = prevRows.filter((_, index) => !selectedRowIndexes.includes(index));

    // Calculate the adjusted destination index
    const adjustedDestinationRowIdx =
      selectedRowIndexes[0] > destinationRowIdx ? destinationRowIdx : destinationRowIdx - selectedRows.length + 1;

    // Create the new array of rows
    const newRows = [
      ...unselectedRows.slice(0, adjustedDestinationRowIdx),
      ...selectedRows,
      ...unselectedRows.slice(adjustedDestinationRowIdx),
    ];

    return newRows;
  });

  setData((prevGridData) => {
    const newGridData = [...prevGridData];

    const movedRows = selectedRowIndexes.map((selectedRowIndex) => newGridData[selectedRowIndex]);

    const sortedSelectedRowIndexes = [...selectedRowIndexes].sort((a, b) => b - a);

    sortedSelectedRowIndexes.forEach((selectedRowIndex) => {
      newGridData.splice(selectedRowIndex, 1);
    });

    // Adjust destination index if it's greater than the selected row indexes
    const adjustedDestinationRowIdx =
      sortedSelectedRowIndexes[0] > destinationRowIdx ? destinationRowIdx : destinationRowIdx - movedRows.length + 1;

    movedRows.forEach((item, index) => {
      newGridData.splice(adjustedDestinationRowIdx + index, 0, item);
    });

    // Update rowIndex for each cell in the new grid data
    newGridData.forEach((row, rowIndex) => {
      row.forEach((cell) => {
        if (cell) {
          cell.rowIndex = rowIndex;
        }
      });
    });

    return newGridData;
  });
};
