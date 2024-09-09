import { Row } from "../../lib/types/PublicModel";

export const handleRowReorder = (
  selectedRowIndexes: number[],
  destinationRowIdx: number,
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

    // update rowIndex for each row
    return newRows.map((row, index) => ({ ...row, rowIndex: index }));
  });
};
