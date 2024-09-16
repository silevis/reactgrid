import { Person } from "./examplesConfig";

export const handleRowReorder = (
  peopleArr: Person[],
  selectedRowIndexes: number[],
  destinationRowIdx: number,
  updatePerson: (id: string, key: string, newValue: number) => void
) => {
  const prevPeopleArr = [...peopleArr].sort((a, b) => a.position - b.position);

  // Adjust the destination index to account for the header row
  const adjustedDestinationIdx = destinationRowIdx - 1;
  const adjustedSelectedRowIdxs = selectedRowIndexes.map((rowIdx) => rowIdx - 1);

  const isReorderingUpwards = adjustedSelectedRowIdxs.some((rowIdx) => rowIdx > adjustedDestinationIdx);

  adjustedSelectedRowIdxs.forEach((rowIdx, index) => {
    if (adjustedDestinationIdx === 0) {
      prevPeopleArr[rowIdx].position = prevPeopleArr[adjustedDestinationIdx].position / 2 + index * 0.01;
    } else if (adjustedDestinationIdx === peopleArr.length - 1) {
      prevPeopleArr[rowIdx].position = prevPeopleArr[adjustedDestinationIdx].position + 1 + index * 0.01;
    } else if (isReorderingUpwards) {
      prevPeopleArr[rowIdx].position =
        (prevPeopleArr[adjustedDestinationIdx].position + prevPeopleArr[adjustedDestinationIdx - 1].position) / 2 +
        index * 0.01;
    } else {
      prevPeopleArr[rowIdx].position =
        (prevPeopleArr[adjustedDestinationIdx].position + prevPeopleArr[adjustedDestinationIdx + 1].position) / 2 +
        index * 0.01;
    }
  });

  prevPeopleArr.forEach((row) => {
    updatePerson(row._id, "position", row.position);
  });
};
