import { CellsLookup } from "../../lib/types/PublicModel";
import { NumericalRange } from "../../lib/types/PublicModel";

export const handlePaste = (event, cellsArea: NumericalRange, cellsLookup: CellsLookup) => {
  const html = event.clipboardData.getData("text/html");

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const rows = doc.querySelectorAll("tr");
  const firstRowCells = rows[0].querySelectorAll("td");

  if (rows.length === 1 && firstRowCells.length === 1) {
    const singleValue = firstRowCells[0].textContent || "";
    for (let rowIndex = cellsArea.startRowIdx; rowIndex < cellsArea.endRowIdx; rowIndex++) {
      for (let colIndex = cellsArea.startColIdx; colIndex < cellsArea.endColIdx; colIndex++) {
        const gridCell = cellsLookup.get(`${rowIndex} ${colIndex}`);
        gridCell?.onStringValueReceived(singleValue);
      }
    }
  } else {
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td");
      cells.forEach((cell, colIndex) => {
        const value = cell.textContent || "";
        const gridCell = cellsLookup.get(`${cellsArea.startRowIdx + rowIndex} ${cellsArea.startColIdx + colIndex}`);
        if (gridCell) {
          gridCell.onStringValueReceived(value);
        }
      });
    });
  }
};
