import { CellsLookup } from "../../lib/types/PublicModel";
import { NumericalRange } from "../../lib/types/PublicModel";

export const handleFill = (
  selectedArea: NumericalRange,
  fillRange: NumericalRange,
  cellsLookup: CellsLookup
): boolean => {
  // Check if the fill handle is being dragged upwards
  const isFillingUpwards = fillRange.startRowIdx < selectedArea.startRowIdx;
  // Calculate the number of rows and columns in the selected area
  const relativeRowSize = selectedArea.endRowIdx - selectedArea.startRowIdx;
  const relativeColSize = selectedArea.endColIdx - selectedArea.startColIdx;

  // Iterate over the rows and columns in the fill range
  for (let i = fillRange.startRowIdx; i < fillRange.endRowIdx; i++) {
    for (let j = fillRange.startColIdx; j < fillRange.endColIdx; j++) {
      const currentCellCallbacks = cellsLookup.get(`${i} ${j}`);

      if (!currentCellCallbacks) continue;

      // Skip cells of type 'header'
      if (i === 0) continue;

      // Calculate the relative row and column indices within the selected area
      const relativeRowIdx = isFillingUpwards
        ? (selectedArea.endRowIdx - i - 1) % relativeRowSize
        : (i - fillRange.startRowIdx) % relativeRowSize;
      const relativeColIdx = (j - fillRange.startColIdx) % relativeColSize;

      // Get the value from the cell in the selected area that corresponds to the relative row and column indices
      const sourceCellCallbacks = cellsLookup.get(
        `${selectedArea.startRowIdx + relativeRowIdx} ${selectedArea.startColIdx + relativeColIdx}`
      );

      if (sourceCellCallbacks) {
        const newValue = sourceCellCallbacks.onStringValueRequsted();
        currentCellCallbacks.onStringValueReceived(newValue);
      }
    }
  }

  return true;
};
