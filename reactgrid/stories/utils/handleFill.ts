import { NumericalRange, CellData } from "../../lib/types/PublicModel";

export const handleFill = (
  selectedArea: NumericalRange,
  fillRange: NumericalRange,
  setCells: React.Dispatch<React.SetStateAction<CellData[]>>
) => {
  setCells((prev) => {
    let next = [...prev];
    // Check if the fill handle is being dragged upwards
    const isFillingUpwards = fillRange.startRowIdx < selectedArea.startRowIdx;
    // Calculate the number of rows and columns in the selected area
    const relativeRowSize = selectedArea.endRowIdx - selectedArea.startRowIdx;
    const relativeColSize = selectedArea.endColIdx - selectedArea.startColIdx;

    // Iterate over the rows and columns in the fill range
    for (let i = fillRange.startRowIdx; i < fillRange.endRowIdx; i++) {
      for (let j = fillRange.startColIdx; j < fillRange.endColIdx; j++) {
        // if (next[i][j] === null) continue;

        const currentCell = next.find((cell) => cell.colIndex === j && cell.rowIndex === i);

        // Skip null cells.
        if (!currentCell) continue;

        let currentCellData = currentCell;

        // Skip cells of type 'header'
        if (i === 0) continue;

        // Calculate the relative row and column indices within the selected area
        const relativeRowIdx = isFillingUpwards
          ? (selectedArea.endRowIdx - i - 1) % relativeRowSize
          : (i - fillRange.startRowIdx) % relativeRowSize;
        const relativeColIdx = (j - fillRange.startColIdx) % relativeColSize;

        // Get the value from the cell in the selected area that corresponds to the relative row and column indices
        // const newValue = prev[selectedArea.startRowIdx + relativeRowIdx][selectedArea.startColIdx + relativeColIdx];
        const newValue = prev.find(
          (cell) =>
            cell.colIndex === selectedArea.startColIdx + relativeColIdx &&
            cell.rowIndex === selectedArea.startRowIdx + relativeRowIdx
        );

        // Set the value of the cell in the fill range to the value from the selected area

        currentCellData = {
          ...currentCellData,
          props: {
            ...currentCellData?.props,
            value: newValue?.props ? newValue.props.value : "",
          },
        };

        next = next.map((cell) => {
          if (cell.colIndex === j && cell.rowIndex === i) {
            return currentCellData;
          }
          return cell;
        });
      }
    }
    return next;
  });
};
