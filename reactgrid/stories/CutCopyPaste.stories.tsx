import React, { StrictMode, useState } from "react";
import {
  Cell,
  CellsLookup,
  CellsLookupCallbacks,
  NonEditableCell,
  NumberCell,
  NumericalRange,
  ReactGrid,
  Row,
  TextCell,
  useReactGridAPI,
} from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { ColumnDef, peopleArr, rgStyles } from "./utils/examplesConfig";
import { ReactGridAPI } from "../lib/hooks/useReactGridAPI";

export const CutCopyPasteExample = () => {
  const [people, setPeople] = useState(peopleArr);

  const columnDefs: ColumnDef[] = Object.keys(peopleArr[0]).reduce(
    (acc: ColumnDef[], peopleKey: string, idx: number) => {
      if (["_id", "position"].includes(peopleKey)) return acc;
      const cellTemplate = peopleKey === "age" ? NumberCell : TextCell;
      return [...acc, { title: peopleKey, width: 100 * idx, cellTemplate }];
    },
    []
  );

  const updatePerson = (id, key, newValue) => {
    setPeople((prev) => {
      return prev.map((p) => (p._id !== id ? p : { ...p, [key]: newValue }));
    });
  };

  const gridRows: Row[] = Array.from({ length: people.length + 1 }, (_, i) => ({
    rowIndex: i,
    height: 40,
  }));

  const gridColumns = columnDefs.map((col, index) => ({
    colIndex: index,
    width: col.width,
  }));

  const cells: Cell[] = [];

  gridRows.forEach((row, rowIndex) => {
    const personRowIndex = row.rowIndex;

    if (rowIndex === 0) {
      columnDefs.forEach((col, colIndex) => {
        cells.push({
          rowIndex,
          colIndex,
          Template: NonEditableCell,
          props: {
            value: col.title,
            style: {
              backgroundColor: "#55bc71",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            },
          },
          isSelectable: false,
        });
      });
    } else {
      const personCells = columnDefs.map((col) => {
        const numberCellProps = {
          onValueChanged: (newValue) => {
            updatePerson(people[personRowIndex - 1]._id, col.title, newValue);
          },
          value: people[personRowIndex - 1][col.title.toLowerCase()],
          allowSeparators: false,
        };

        const textCellProps = {
          text: people[personRowIndex - 1][col.title.toLowerCase()],
          onTextChanged: (newText: string) => {
            updatePerson(people[personRowIndex - 1]._id, col.title, newText);
          },
        };

        return {
          Template: col.cellTemplate,
          props: col.title === "age" ? numberCellProps : textCellProps,
        };
      });

      columnDefs.forEach((_, colIndex) => {
        cells.push({
          rowIndex,
          colIndex,
          ...personCells[colIndex],
        });
      });
    }
  });

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
        rows={gridRows}
        columns={gridColumns}
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
    .map((element) => element.onStringValueRequsted());

  cellsLookupCallbacks.forEach((element) => element && element.onStringValueReceived?.(""));

  const htmlData = `
  <table>
    ${Array.from(
      { length: cellsRange.endRowIdx - cellsRange.startRowIdx },
      (_, rowIndex) => `
      <tr>
        ${Array.from({ length: cellsRange.endColIdx - cellsRange.startColIdx }, (_, colIndex) => {
          const cell = cellsLookup.get(`${cellsRange.startRowIdx + rowIndex} ${cellsRange.startColIdx + colIndex}`);
          const value = cell?.onStringValueRequsted?.() || "";
          return `<td>${value}</td>`;
        }).join("")}
      </tr>
    `
    ).join("")}
  </table>
`;

  event.clipboardData.setData("text/html", htmlData);
  event.clipboardData.setData("text/plain", values.join("\t"));

  // Override the default cut behavior
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
    .map((element) => element.onStringValueRequsted());

  const htmlData = `
  <table>
    ${Array.from(
      { length: cellsRange.endRowIdx - cellsRange.startRowIdx },
      (_, rowIndex) => `
      <tr>
        ${Array.from({ length: cellsRange.endColIdx - cellsRange.startColIdx }, (_, colIndex) => {
          const cell = cellsLookup.get(`${cellsRange.startRowIdx + rowIndex} ${cellsRange.startColIdx + colIndex}`);
          const value = cell?.onStringValueRequsted?.() || "";
          return `<td>${value}</td>`;
        }).join("")}
      </tr>
    `
    ).join("")}
  </table>
`;

  event.clipboardData.setData("text/html", htmlData);
  event.clipboardData.setData("text/plain", values.join("\t"));

  // Override the default copy behavior
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

  // Override the default paste behavior
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
