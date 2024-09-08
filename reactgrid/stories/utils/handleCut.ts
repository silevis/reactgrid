import { GridLookup, GridLookupCallbacks } from "../../lib/types/PublicModel";
import { NumericalRange } from "../../lib/types/PublicModel";
import { findGridLookupCallbacks } from "../../lib/utils/findGridLookupCallbacks";

export const handleCut = (event, cellsRange: NumericalRange, gridLookup: GridLookup) => {
  const gridLookupCallbacks: GridLookupCallbacks[] = findGridLookupCallbacks(cellsRange, gridLookup);

  const values = gridLookupCallbacks.map((element) => element.onStringValueRequsted());

  gridLookupCallbacks.forEach((element) => element.onStringValueReceived(""));

  const htmlData = `
      <table>
        ${Array.from(
          { length: cellsRange.endRowIdx - cellsRange.startRowIdx },
          (_, rowIndex) => `
          <tr>
            ${Array.from({ length: cellsRange.endColIdx - cellsRange.startColIdx }, (_, colIndex) => {
              const cell = gridLookup.get(`${cellsRange.startRowIdx + rowIndex} ${cellsRange.startColIdx + colIndex}`);
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
};
