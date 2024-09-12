import { RowDef } from "./examplesConfig";

export const handleRowReorder = (
  selectedRowIndexes: number[],
  destinationRowIdx: number,
  setRowDefs: React.Dispatch<React.SetStateAction<RowDef[]>>
) => {
  setRowDefs((prevRows) => {
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
};
