import { NumericalRange } from "../../types/CellMatrix";

export const onCopyHandler = <T>(data: T[][], selectedArea: NumericalRange) => {
  // copy the data from the selected area to the clipboard
  const selectedData = data
    .slice(selectedArea.startRowIdx, selectedArea.endRowIdx)
    .map((row) => row.slice(selectedArea.startColIdx, selectedArea.endColIdx));

  navigator.clipboard.writeText(JSON.stringify(selectedData));
};
