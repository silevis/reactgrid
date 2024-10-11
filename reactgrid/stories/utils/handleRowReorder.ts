import { Row } from "../../lib/main";
import { Person } from "./examplesConfig";

export const handleRowReorder = (
  peopleArr: Person[],
  selectedRowIndexes: number[],
  destinationRowIdx: number,
  updatePerson: (id: string, key: string, newValue: number) => void,
  setRows: (value: React.SetStateAction<Row[]>) => void
) => {
  // Step 1: Reorder the rows
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

    // Update rowIndex for each row
    return newRows.map((row, index) => ({ ...row, rowIndex: index }));
  });

  // Step 2: Update the position of each person in the people array

  const prevPeopleArr = [...peopleArr].sort((a, b) => a.position - b.position);

  // Adjust the destination index to account for the header row
  const adjustedDestinationIdx = destinationRowIdx - 1;
  const adjustedSelectedRowIdxs = selectedRowIndexes.map((rowIdx) => rowIdx - 1);

  const isReorderingUpwards = adjustedSelectedRowIdxs.some((rowIdx) => rowIdx > adjustedDestinationIdx);

  adjustedSelectedRowIdxs.forEach((rowIdx, index) => {
    if (adjustedDestinationIdx === 0) {
      prevPeopleArr[rowIdx].position = prevPeopleArr[adjustedDestinationIdx].position / 2 + index * 0.0001;
    } else if (adjustedDestinationIdx === peopleArr.length - 1) {
      prevPeopleArr[rowIdx].position = prevPeopleArr[adjustedDestinationIdx].position + 1 + index * 0.0001;
    } else if (isReorderingUpwards) {
      prevPeopleArr[rowIdx].position =
        (prevPeopleArr[adjustedDestinationIdx].position + prevPeopleArr[adjustedDestinationIdx - 1].position) / 2 +
        index * 0.0001;
    } else {
      prevPeopleArr[rowIdx].position =
        (prevPeopleArr[adjustedDestinationIdx].position + prevPeopleArr[adjustedDestinationIdx + 1].position) / 2 +
        index * 0.0001;
    }
  });

  prevPeopleArr.forEach((row) => {
    updatePerson(row.id, "position", row.position);
  });
};
