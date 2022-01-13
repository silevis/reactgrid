import { ProState } from "../Model/ProState";
import {
  Location,
  Range,
  getCompatibleCellAndTemplate,
  Id,
  createHTMLElements,
  setStyles,
  clearCell,
} from "../../core";

export function getProDataToCopy(
  state: ProState,
  activeSelectedRange: Range,
  removeValues = false
): { div: HTMLDivElement; text: string } {
  const { div, table, location } = createHTMLElements(activeSelectedRange);
  const text = copyElements(
    state,
    location,
    activeSelectedRange,
    table,
    removeValues
  );
  setStyles(div, table);
  return { div, text };
}

function copyElements(
  state: ProState,
  location: Location,
  activeSelectedRange: Range,
  table: HTMLTableElement,
  removeValues: boolean
): string {
  let text = "";
  let prevId: Id = "";
  activeSelectedRange.rows.forEach((row) => {
    const tableRow = table.insertRow();
    activeSelectedRange.columns.forEach((column) => {
      const tableCell = tableRow.insertCell();
      const { cell } = getCompatibleCellAndTemplate(state, { row, column });
      const validatedText = cell.text || " ";
      tableCell.textContent = validatedText;
      text =
        prevId === ""
          ? cell.text
          : text + (prevId === row.rowId ? "\t" : "\n") + validatedText;
      prevId = row.rowId;
      tableCell.setAttribute("data-reactgrid", JSON.stringify(cell));
      tableCell.style.border = "1px solid #D3D3D3";
      clearCell(state as ProState, { row, column }, removeValues);
    });
  });

  return text;
}
