import { NumericalRange } from "../../lib/types/CellMatrix";

export const handleCut = <T>(
  data: T[][],
  selectedArea: NumericalRange,
  setData: React.Dispatch<React.SetStateAction<T[][]>>
) => {
  // copy the data from the selected area to the clipboard
  const selectedData = data
    .slice(selectedArea.startRowIdx, selectedArea.endRowIdx)
    .map((row) => row.slice(selectedArea.startColIdx, selectedArea.endColIdx));

  navigator.clipboard.writeText(JSON.stringify(selectedData));

  // remove the data from the selected area
  setData((prev) => {
    const next = [...prev];
    for (let i = selectedArea.startRowIdx; i < selectedArea.endRowIdx; i++) {
      for (let j = selectedArea.startColIdx; j < selectedArea.endColIdx; j++) {
        if (next[i][j] !== null) next[i][j] = { ...data[i][j], value: "" };
      }
    }
    return next;
  });
};
