import { NumericalRange } from "../../types/CellMatrix";
import { parseLocaleNumber } from "../../utils/parseLocaleNumber";

type CellData = {
  text?: string;
  number?: number;
  date?: Date;
};

type SetData<T extends CellData> = React.Dispatch<React.SetStateAction<(T | null)[][]>>;

export const handleFill = (selectedArea: NumericalRange, fillRange: NumericalRange, setData: SetData<CellData>) => {
  setData((prev) => {
    const next = [...prev];
    // Check if the fill handle is being dragged upwards
    const isFillingUpwards = fillRange.startRowIdx < selectedArea.startRowIdx;
    // Calculate the number of rows and columns in the selected area
    const relativeRowSize = selectedArea.endRowIdx - selectedArea.startRowIdx;
    const relativeColSize = selectedArea.endColIdx - selectedArea.startColIdx;

    // Iterate over the rows and columns in the fill range
    for (let i = fillRange.startRowIdx; i < fillRange.endRowIdx; i++) {
      for (let j = fillRange.startColIdx; j < fillRange.endColIdx; j++) {
        // Skip null cells.
        if (next[i][j] === null) continue;

        // Calculate the relative row and column indices within the selected area
        const relativeRowIdx = isFillingUpwards
          ? (selectedArea.endRowIdx - i - 1) % relativeRowSize
          : (i - fillRange.startRowIdx) % relativeRowSize;
        const relativeColIdx = (j - fillRange.startColIdx) % relativeColSize;

        // Get the value from the cell in the selected area that corresponds to the relative row and column indices
        const newValue = prev[selectedArea.startRowIdx + relativeRowIdx][selectedArea.startColIdx + relativeColIdx];

        // Set the value of the cell in the fill range to the value from the selected area
        next[i][j] = {
          text: newValue?.number ? newValue.number.toString() : newValue?.text,
          number: newValue?.number ?? parseLocaleNumber(newValue?.text),
        };
      }
    }
    return next;
  });
};
