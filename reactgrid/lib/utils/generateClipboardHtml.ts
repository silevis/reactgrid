import { GridLookup } from "../types/InternalModel";
import { NumericalRange } from "../types/PublicModel";

export const generateClipboardHtml = (cellsArea: NumericalRange, gridLookup: GridLookup) => {
  const htmlData = `
      <table>
        ${Array.from(
          { length: cellsArea.endRowIdx - cellsArea.startRowIdx },
          (_, rowIndex) => `
          <tr>
            ${Array.from({ length: cellsArea.endColIdx - cellsArea.startColIdx }, (_, colIndex) => {
              const cell = gridLookup.get(`${cellsArea.startRowIdx + rowIndex} ${cellsArea.startColIdx + colIndex}`);
              const value = cell?.onStringValueRequsted() || "";
              return `<td>${value}</td>`;
            }).join("")}
          </tr>
        `
        ).join("")}
      </table>
    `;

  return htmlData;
};
