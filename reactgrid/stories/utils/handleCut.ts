import { CellData, NumericalRange } from "../../lib/types/PublicModel";

export const handleCut = (
  cells: CellData[],
  selectedArea: NumericalRange,
  setCells: React.Dispatch<React.SetStateAction<CellData[]>>
) => {
  const selectedData = cells.filter(
    (cell) =>
      cell.rowIndex >= selectedArea.startRowIdx &&
      cell.colIndex >= selectedArea.startColIdx &&
      cell.rowIndex < selectedArea.endRowIdx &&
      cell.colIndex < selectedArea.endColIdx
  );

  // Organize the selected data into a 2D array including rowIndex and colIndex
  const numRows = selectedArea.endRowIdx - selectedArea.startRowIdx;
  const numCols = selectedArea.endColIdx - selectedArea.startColIdx;
  const organizedData = Array.from({ length: numRows }, () => Array(numCols).fill(""));

  selectedData.forEach((cell) => {
    const row = cell.rowIndex - selectedArea.startRowIdx;
    const col = cell.colIndex - selectedArea.startColIdx;
    organizedData[row][col] = cell.props?.value || "";
  });

  // Convert the organized data to an HTML table string
  const htmlData = `
  <table>
    ${organizedData
      .map(
        (row) => `
      <tr>
        ${row.map((value) => `<td>${value || ""}</td>`).join("")}
      </tr>
    `
      )
      .join("")}
  </table>
`;

  // Create a ClipboardItem with the HTML string
  const clipboardItem = new ClipboardItem({
    "text/html": new Blob([htmlData], { type: "text/html" }),
  });

  // Write the ClipboardItem to the clipboard
  navigator.clipboard.write([clipboardItem]);

  // Update cells data
  setCells((prev) => {
    return prev.map((cell) => {
      const cuttedCell = selectedData.find(
        (cell_) => cell_.rowIndex === cell.rowIndex && cell_.colIndex === cell.colIndex
      );

      if (cuttedCell) {
        return {
          ...cell,
          props: { ...cell.props, value: "" },
        };
      }

      return cell;
    });
  });
};
