import { CellData, NumericalRange } from "../../lib/types/PublicModel";

export const handlePaste = (
  selectedArea: NumericalRange,
  pastedData: string,
  setData: React.Dispatch<React.SetStateAction<CellData[][]>>
) => {
  // parse the pasted data
  const parsedData = JSON.parse(pastedData);

  setData((prev) => {
    const next = [...prev];
    for (let i = 0; i < parsedData.length; i++) {
      for (let j = 0; j < parsedData[i].length; j++) {
        const rowIdx = selectedArea.startRowIdx + i;
        const colIdx = selectedArea.startColIdx + j;
        if (next[rowIdx] && next[rowIdx][colIdx] !== null) {
          next[rowIdx][colIdx] = {
            ...next[rowIdx][colIdx],
            props: { ...next[rowIdx][colIdx].props, value: parsedData[i][j]?.props?.value || "" },
          };
        }
      }
    }
    return next;
  });
};
