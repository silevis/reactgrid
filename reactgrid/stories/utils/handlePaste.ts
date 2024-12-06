import { ReactGridAPI } from "../../lib/hooks/useReactGridAPI";
import { CellsLookup } from "../../lib/types/PublicModel";
import { NumericalRange } from "../../lib/types/PublicModel";

export const handlePaste = (
  event,
  cellsRange: NumericalRange,
  cellsLookup: CellsLookup,
  gridAPI?: ReactGridAPI | undefined
): boolean => {
  const html = event.clipboardData.getData("text/html");

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const rows = doc.querySelectorAll("tr");
  const firstRowCells = rows[0].querySelectorAll("td");

  if (rows.length === 1 && firstRowCells.length === 1) {
    const singleValue = firstRowCells[0].textContent || "";
    for (let rowIndex = cellsRange.startRowIdx; rowIndex < cellsRange.endRowIdx; rowIndex++) {
      for (let colIndex = cellsRange.startColIdx; colIndex < cellsRange.endColIdx; colIndex++) {
        const gridCell = cellsLookup.get(`${rowIndex} ${colIndex}`);
        gridCell?.onStringValueReceived(singleValue);
      }
    }
  } else {
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td");
      cells.forEach((cell, colIndex) => {
        const value = cell.textContent || "";
        const gridCell = cellsLookup.get(`${cellsRange.startRowIdx + rowIndex} ${cellsRange.startColIdx + colIndex}`);
        if (gridCell) {
          gridCell.onStringValueReceived(value);
        }
      });
    });
  }

  let newSelectedArea;

  // If only one cell was pasted
  if (rows.length === 1 && firstRowCells.length === 1) {
    newSelectedArea = {
      startRowIdx: cellsRange.startRowIdx,
      endRowIdx: cellsRange.endRowIdx,
      startColIdx: cellsRange.startColIdx,
      endColIdx: cellsRange.endColIdx,
    };
  }
  // If multiple cells were pasted
  else {
    const columnsAmount = gridAPI?.getColumns().length ?? 0;
    const rowsAmount = gridAPI?.getRows().length ?? 0;

    const endRowIdx = Math.min(cellsRange.startRowIdx + rows.length, columnsAmount);
    const endColIdx = Math.min(cellsRange.startColIdx + rows[0].querySelectorAll("td").length, rowsAmount);

    newSelectedArea = {
      startRowIdx: cellsRange.startRowIdx,
      endRowIdx: endRowIdx,
      startColIdx: cellsRange.startColIdx,
      endColIdx: endColIdx,
    };
  }

  gridAPI?.setSelectedArea(newSelectedArea);

  return true;
};
