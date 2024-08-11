import { CellData, NumericalRange } from "../../lib/types/PublicModel";

export const handleCut = (
  data: CellData[][],
  selectedArea: NumericalRange,
  setData: React.Dispatch<React.SetStateAction<CellData[][]>>
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
        if (next[i][j] !== null) next[i][j] = { ...data[i][j], props: { ...data[i][j].props, value: "" } };
      }
    }
    return next;
  });
};
