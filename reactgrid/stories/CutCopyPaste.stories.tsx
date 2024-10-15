import React, { StrictMode, useState } from "react";
import { CellsLookup, CellsLookupCallbacks, NumericalRange, ReactGrid, useReactGridAPI } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { ReactGridAPI } from "../lib/hooks/useReactGridAPI";
import { peopleArr, getRows, getColumns, generateCells, rgStyles } from "./utils/examplesConfig";

export const CutCopyPasteExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p.id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const rows = getRows(people);
  const columns = getColumns();
  const cells = generateCells(people, updatePerson);

  const gridAPI = useReactGridAPI("cut-copy-paste-example");

  return (
    <div>
      <ReactGrid
        id="cut-copy-paste-example"
        styles={rgStyles}
        onCut={(event, cellsRange, cellsLookup) => handleCut(event, cellsRange, cellsLookup)}
        onCopy={(event, cellsRange, cellsLookup) => handleCopy(event, cellsRange, cellsLookup)}
        onPaste={(event, cellsRange, cellsLookup) => handlePaste(event, cellsRange, cellsLookup, gridAPI)}
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        rows={rows}
        columns={columns}
        cells={cells}
      />
    </div>
  );
};

const handleCut = (
  event: React.ClipboardEvent<HTMLDivElement>,
  cellsRange: NumericalRange,
  cellsLookup: CellsLookup
) => {
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

  const values = cellsLookupCallbacks
    .filter((element) => element && Object.keys(element).length > 0)
    .map((element) => element.onStringValueRequested());

  cellsLookupCallbacks.forEach((element) => element && element.onStringValueReceived?.(""));

  const htmlData = `
  <table>
    ${Array.from(
      { length: cellsRange.endRowIdx - cellsRange.startRowIdx },
      (_, rowIndex) => `
      <tr>
        ${Array.from({ length: cellsRange.endColIdx - cellsRange.startColIdx }, (_, colIndex) => {
          const cell = cellsLookup.get(`${cellsRange.startRowIdx + rowIndex} ${cellsRange.startColIdx + colIndex}`);
          const value = cell?.onStringValueRequested?.() || "";
          return `<td>${value}</td>`;
        }).join("")}
      </tr>
    `
    ).join("")}
  </table>
`;

  event.clipboardData.setData("text/html", htmlData);
  event.clipboardData.setData("text/plain", values.join("\t"));

  // Prevent the default cut behavior
  return true;
};

const handleCopy = (
  event: React.ClipboardEvent<HTMLDivElement>,
  cellsRange: NumericalRange,
  cellsLookup: CellsLookup
) => {
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

  const values = cellsLookupCallbacks
    .filter((element) => element && Object.keys(element).length > 0)
    .map((element) => element.onStringValueRequested());

  const htmlData = `
  <table>
    ${Array.from(
      { length: cellsRange.endRowIdx - cellsRange.startRowIdx },
      (_, rowIndex) => `
      <tr>
        ${Array.from({ length: cellsRange.endColIdx - cellsRange.startColIdx }, (_, colIndex) => {
          const cell = cellsLookup.get(`${cellsRange.startRowIdx + rowIndex} ${cellsRange.startColIdx + colIndex}`);
          const value = cell?.onStringValueRequested?.() || "";
          return `<td>${value}</td>`;
        }).join("")}
      </tr>
    `
    ).join("")}
  </table>
`;

  event.clipboardData.setData("text/html", htmlData);
  event.clipboardData.setData("text/plain", values.join("\t"));

  // Prevent the default copy behavior
  return true;
};

const handlePaste = (
  event: React.ClipboardEvent<HTMLDivElement>,
  cellsRange: NumericalRange,
  cellsLookup: CellsLookup,
  gridAPI?: ReactGridAPI
) => {
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
          gridCell.onStringValueReceived?.(value);
        }
      });
    });
  }

  if (gridAPI) {
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
      const endRowIdx = Math.min(cellsRange.startRowIdx + rows.length, gridAPI.getRows().length);
      const endColIdx = Math.min(
        cellsRange.startColIdx + rows[0].querySelectorAll("td").length,
        gridAPI.getColumns().length
      );

      newSelectedArea = {
        startRowIdx: cellsRange.startRowIdx,
        endRowIdx: endRowIdx,
        startColIdx: cellsRange.startColIdx,
        endColIdx: endColIdx,
      };
    }

    gridAPI.setSelectedArea(newSelectedArea);
  }

  // Prevent the default paste behavior
  return true;
};

export default {
  decorators: [
    (Component) => (
      <StrictMode>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </StrictMode>
    ),
  ],
} satisfies StoryDefault;
