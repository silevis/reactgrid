import { Cell, NumericalRange } from "../../lib/types/PublicModel";

export const handlePaste = (
  selectedArea: NumericalRange,
  pastedData: string,
  setData: React.Dispatch<React.SetStateAction<Cell[]>>
) => {
  // Parse the pasted HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(pastedData, "text/html");

  // Extract table rows from the parsed HTML
  const rows = doc.querySelectorAll("tr");

  // Initialize a 2D array with empty strings
  const numRows = rows.length;
  const numCols = Math.max(...Array.from(rows).map((row) => row.querySelectorAll("td").length));
  const newValues: string[][] = Array.from({ length: numRows }, () => Array(numCols).fill(""));

  // Populate the 2D array with the parsed cell values
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll("td");
    cells.forEach((cell, colIndex) => {
      const value = cell.textContent || "";
      newValues[rowIndex][colIndex] = value;
    });
  });

  // Update the cells data in the state
  setData((prevCells) => {
    // Map over the previous cells and replace values within the selected area with newValues
    const updatedCells = prevCells.map((cell) => {
      const relativeRow = cell.rowIndex - selectedArea.startRowIdx;
      const relativeCol = cell.colIndex - selectedArea.startColIdx;

      if (relativeRow >= 0 && relativeRow < numRows && relativeCol >= 0 && relativeCol < numCols) {
        return {
          ...cell,
          props: { ...cell.props, value: newValues[relativeRow][relativeCol] },
        };
      }

      return cell;
    });

    return updatedCells;
  });
};
