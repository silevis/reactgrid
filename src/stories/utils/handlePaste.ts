import { NumericalRange } from "../../types/CellMatrix";

export const handlePaste = <T>(
  selectedArea: NumericalRange,
  pastedData: string,
  setData: React.Dispatch<React.SetStateAction<T[][]>>
) => {
  // parse the pasted data
  const parsedData = JSON.parse(pastedData);

  setData((prev) => {
    const next = [...prev];
    for (let i = 0; i < parsedData.length; i++) {
      for (let j = 0; j < parsedData[i].length; j++) {
        const rowIdx = selectedArea.startRowIdx + i;
        const colIdx = selectedArea.startColIdx + j;
        if (next[rowIdx] && next[rowIdx][colIdx] !== undefined) {
          next[rowIdx][colIdx] = parsedData[i][j];
        }
      }
    }
    return next;
  });
};
