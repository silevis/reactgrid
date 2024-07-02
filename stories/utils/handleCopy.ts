import { NumericalRange } from "../../lib/types/CellMatrix";

export const handleCopy = <T>(data: T[][], selectedArea: NumericalRange) => {
  // copy the data from the selected area to the clipboard
  const selectedData = data
    .slice(selectedArea.startRowIdx, selectedArea.endRowIdx)
    .map((row) => row.slice(selectedArea.startColIdx, selectedArea.endColIdx))
    .map((row) => row.filter((cell) => cell !== null))
    .filter((row) => row.length > 0);

  navigator.clipboard.writeText(JSON.stringify(selectedData));
};
