import { CellsLookup, CellsLookupCallbacks } from "../../lib/types/PublicModel";
import { NumericalRange } from "../../lib/types/PublicModel";

export const handleCopy = (event, cellsRange: NumericalRange, cellsLookup: CellsLookup): boolean => {
  const { startRowIdx, endRowIdx, startColIdx, endColIdx } = cellsRange;
  const cellsLookupCallbacks: CellsLookupCallbacks[] = [];

  for (let rowIdx = startRowIdx; rowIdx < endRowIdx; rowIdx++) {
    for (let colIdx = startColIdx; colIdx < endColIdx; colIdx++) {
      const element = cellsLookup.get(`${rowIdx} ${colIdx}`);
      if (element) {
        cellsLookupCallbacks.push(element);
      }
    }
  }

  const values = cellsLookupCallbacks.map((element) => element.onStringValueRequsted());

  const htmlData = `
      <table>
        ${Array.from(
          { length: cellsRange.endRowIdx - cellsRange.startRowIdx },
          (_, rowIndex) => `
          <tr>
            ${Array.from({ length: cellsRange.endColIdx - cellsRange.startColIdx }, (_, colIndex) => {
              const cell = cellsLookup.get(`${cellsRange.startRowIdx + rowIndex} ${cellsRange.startColIdx + colIndex}`);
              const value = cell?.onStringValueRequsted() || "";
              return `<td>${value}</td>`;
            }).join("")}
          </tr>
        `
        ).join("")}
      </table>
    `;

  event.clipboardData.setData("text/html", htmlData);
  event.clipboardData.setData("text/plain", values.join("\t"));

  return true;
};
